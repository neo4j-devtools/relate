import {exec} from 'child_process';
import fse from 'fs-extra';
import {coerce} from 'semver';
import {promisify} from 'util';
import path from 'path';
import {List, None} from '@relate/types';

import {
    AmbiguousTargetError,
    ExtensionExistsError,
    InvalidArgumentError,
    NotFoundError,
    NotSupportedError,
    ValidationFailureError,
} from '../../errors';
import {ENTITY_TYPES, EXTENSION_TYPES, HOOK_EVENTS} from '../../constants';
import {emitHookEvent} from '../../utils';
import {applyEntityFilters, IRelateFilter, isValidUrl} from '../../utils/generic';
import {
    discoverExtension,
    discoverExtensionDistributions,
    downloadExtension,
    extractExtension,
    fetchExtensionVersions,
    getAppBasePath,
    IExtensionMeta,
    IExtensionVersion,
} from '../../utils/extensions';
import {ExtensionsAbstract} from './extensions.abstract';
import {LocalEnvironment} from '../environments/environment.local';
import {AppLaunchTokenModel, IAppLaunchToken} from '../../models';
import {TokenService} from '../../token.service';

export class LocalExtensions extends ExtensionsAbstract<LocalEnvironment> {
    async getAppPath(appName: string, appRoot = ''): Promise<string> {
        const appBase = await getAppBasePath(appName);

        return `${appRoot}${appBase}`;
    }

    async versions(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionVersion>> {
        return applyEntityFilters(await fetchExtensionVersions(), filters);
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionMeta>> {
        const allInstalledExtensions = await discoverExtensionDistributions(this.environment.dirPaths.extensionsData);

        return applyEntityFilters(allInstalledExtensions.flatten(), filters);
    }

    async listApps(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionMeta>> {
        const extensions = await this.list(filters);

        return extensions.filter(({type}) => type === EXTENSION_TYPES.STATIC);
    }

    async link(filePath: string): Promise<IExtensionMeta> {
        const extension = await discoverExtension(filePath);
        const target = this.environment.getEntityRootPath(ENTITY_TYPES.EXTENSION, extension.name);

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.symlink(filePath, target, 'junction');

        if (extension.type === EXTENSION_TYPES.STATIC) {
            const staticTarget = path.join(
                this.environment.dirPaths.extensionsData,
                EXTENSION_TYPES.STATIC,
                extension.name,
            );

            await fse.symlink(target, staticTarget, 'junction');
        }

        return extension;
    }

    async install(name: string, version: string): Promise<IExtensionMeta> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        const {extensionsCache} = this.environment.dirPaths;

        // version as a file path.
        if ((await fse.pathExists(version)) && (await fse.stat(version)).isFile()) {
            // extract extension to cache dir first
            const {name: extensionName, dist, version: extensionVersion} = await extractExtension(
                version,
                extensionsCache,
            );

            // move the extracted dir
            const destination = path.join(extensionsCache, `${extensionName}@${extensionVersion}`);

            await fse.move(dist, destination, {
                overwrite: true,
            });

            try {
                const discovered = await discoverExtension(destination);

                return this.installRelateExtension(discovered, discovered.dist);
            } catch (e) {
                throw new NotFoundError(`Unable to find the requested version: ${version}`);
            }
        }

        // @todo: version as a URL.
        if (isValidUrl(version)) {
            throw new NotSupportedError(`fetch and install extension ${name}@${version}`);
        }

        const coercedVersion = coerce(version)?.version;
        if (coercedVersion) {
            const dists = List.from(await discoverExtensionDistributions(extensionsCache));
            const requestedDistribution = await dists
                .find((dist) => dist.name === name && dist.version === coercedVersion)
                .flatMap((requested) => {
                    if (None.isNone(requested)) {
                        try {
                            return downloadExtension(name, coercedVersion, extensionsCache);
                        } catch (e) {
                            throw new NotFoundError(`Unable to find the requested version: ${version} online`);
                        }
                    }

                    return requested;
                });

            return this.installRelateExtension(requestedDistribution, requestedDistribution.dist);
        }

        throw new InvalidArgumentError('Provided version argument is not valid semver, url or path.');
    }

    private async installRelateExtension(
        extension: IExtensionMeta,
        extractedDistPath: string,
    ): Promise<IExtensionMeta> {
        const target = this.environment.getEntityRootPath(ENTITY_TYPES.EXTENSION, extension.name);

        if (!(await fse.pathExists(extractedDistPath))) {
            throw new AmbiguousTargetError(`Path to extension does not exist "${extractedDistPath}"`);
        }

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.copy(extractedDistPath, target);

        if (extension.type === EXTENSION_TYPES.STATIC) {
            const staticTarget = path.join(this.environment.dirPaths.staticExtensionsData, extension.name);

            await fse.symlink(target, staticTarget, 'junction');
        }

        // @todo: need to look at our use of exec (and maybe child processes) in general
        // this does not account for all scenarios at the moment so needs more thought
        const execute = promisify(exec);

        try {
            await emitHookEvent(
                HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_START,
                `installing dependencies for ${extension.name}`,
            );
            const output = await execute('npm install --production', {
                cwd: target,
            });
            await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP, output);
        } catch (err) {
            throw new Error(err);
        }

        return extension;
    }

    async uninstall(name: string): Promise<List<IExtensionMeta>> {
        // @todo: this is uninstalling only static extensions
        const installedExtensions = await this.list();
        // @todo: if more than one version installed, would need to filter version too
        const targets = installedExtensions.filter((ext) => ext.name === name);

        if (targets.isEmpty) {
            throw new InvalidArgumentError(`Extension ${name} is not installed`);
        }

        return targets
            .mapEach(async (ext) => {
                await fse.remove(ext.dist);

                if (ext.type === EXTENSION_TYPES.STATIC) {
                    const staticTarget = path.join(this.environment.dirPaths.staticExtensionsData, ext.name);

                    await fse.remove(staticTarget);
                }

                return ext;
            })
            .unwindPromises();
    }

    createAppLaunchToken(
        appName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
        projectId?: string,
    ): Promise<string> {
        const validated = JSON.parse(
            JSON.stringify(
                new AppLaunchTokenModel({
                    accessToken,
                    appName,
                    dbmsId,
                    environmentId: this.environment.id,
                    principal,
                    projectId,
                }),
            ),
        );

        return TokenService.sign(validated, appName);
    }

    parseAppLaunchToken(appName: string, launchToken: string): Promise<IAppLaunchToken> {
        return TokenService.verify(launchToken, appName)
            .then((decoded: any) => {
                if (decoded.appName !== appName) {
                    throw new ValidationFailureError('App Launch Token mismatch');
                }

                return new AppLaunchTokenModel({
                    accessToken: decoded.accessToken,
                    appName: decoded.appName,
                    dbmsId: decoded.dbmsId,
                    environmentId: decoded.environmentId,
                    principal: decoded.principal,
                    projectId: decoded.projectId,
                });
            })
            .catch((e) => {
                if (e instanceof ValidationFailureError) {
                    throw e;
                }

                throw new ValidationFailureError('Invalid App Launch Token');
            });
    }
}
