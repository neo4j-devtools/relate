import {exec} from 'child_process';
import fse from 'fs-extra';
import {valid} from 'semver';
import {promisify} from 'util';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import {List, None} from '@relate/types';

import {
    AmbiguousTargetError,
    ExtensionExistsError,
    InvalidArgumentError,
    NotFoundError,
    ValidationFailureError,
} from '../../errors';
import {ENTITY_TYPES, EXTENSION_TYPES, HOOK_EVENTS} from '../../constants';
import {download, emitHookEvent} from '../../utils';
import {applyEntityFilters, IRelateFilter, isValidUrl} from '../../utils/generic';
import {
    discoverExtension,
    discoverExtensionDistributions,
    downloadExtension,
    extractExtension,
    fetchExtensionVersions,
    getAppBasePath,
    IExtensionVersion,
} from '../../utils/extensions';
import {ExtensionsAbstract} from './extensions.abstract';
import {LocalEnvironment} from '../environments/environment.local';
import {AppLaunchTokenModel, IAppLaunchToken, IExtensionInfo} from '../../models';
import {TokenService} from '../../token.service';

export class LocalExtensions extends ExtensionsAbstract<LocalEnvironment> {
    async getAppPath(appName: string, appRoot = ''): Promise<string> {
        const appBase = await getAppBasePath(appName);

        return isValidUrl(appBase) ? appBase : `${appRoot}${appBase}`;
    }

    async versions(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionVersion>> {
        return applyEntityFilters(await fetchExtensionVersions(), filters);
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionInfo>> {
        const allInstalledExtensions = await discoverExtensionDistributions(this.environment.dirPaths.extensionsData);

        return applyEntityFilters(allInstalledExtensions.flatten(), filters);
    }

    async listApps(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionInfo>> {
        const extensions = await this.list(filters);

        return extensions.filter(({type}) => type === EXTENSION_TYPES.STATIC);
    }

    async link(filePath: string): Promise<IExtensionInfo> {
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

    async install(name: string, version: string): Promise<IExtensionInfo> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        const {extensionsCache, tmp} = this.environment.dirPaths;
        const isFilePath = (await fse.pathExists(version)) && (await fse.stat(version)).isFile();

        // version as a file path or URL.
        if (isFilePath || isValidUrl(version)) {
            let toExtract = version;

            if (isValidUrl(version)) {
                const tmpDownloadPath = path.join(tmp, uuidv4());

                await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_DOWNLOAD_START, null);

                toExtract = await download(version, tmpDownloadPath);

                await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_DOWNLOAD_STOP, null);
            }

            // extract extension to tmp first
            const tmpExtractPath = path.join(tmp, uuidv4());
            const {name: extensionName, dist, version: extensionVersion} = await extractExtension(
                toExtract,
                tmpExtractPath,
            );
            const cacheDir = path.join(extensionsCache, `${extensionName}@${extensionVersion}`);

            // move the extracted dir to cache
            await fse.move(dist, cacheDir, {
                overwrite: true,
            });
            await fse.remove(tmpExtractPath);

            try {
                const discovered = await discoverExtension(cacheDir);

                return this.installRelateExtension(discovered, discovered.dist).finally(() => fse.remove(cacheDir));
            } catch (e) {
                throw new NotFoundError(`Unable to find the requested version: ${version}`);
            }
        }

        const coercedVersion = valid(version);
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
        extension: IExtensionInfo,
        extractedDistPath: string,
    ): Promise<IExtensionInfo> {
        const target = this.environment.getEntityRootPath(ENTITY_TYPES.EXTENSION, extension.name);

        if (!(await fse.pathExists(extractedDistPath))) {
            throw new AmbiguousTargetError(`Path to extension does not exist "${extractedDistPath}"`);
        }

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.copy(extractedDistPath, target);

        if (extension.type === EXTENSION_TYPES.STATIC && !isValidUrl(extension.main)) {
            const staticTarget = path.join(this.environment.dirPaths.staticExtensionsData, extension.name);

            await fse.symlink(target, staticTarget, 'junction');
        }

        // @todo: need to look at our use of exec (and maybe child processes) in general
        // this does not account for all scenarios at the moment so needs more thought
        const execute = promisify(exec);

        if (extension.type !== EXTENSION_TYPES.STATIC) {
            await emitHookEvent(
                HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_START,
                `installing dependencies for ${extension.name}`,
            );
            const output = await execute('npm ci --production', {
                cwd: target,
            });
            await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP, output);
        }

        return extension;
    }

    async uninstall(name: string): Promise<List<IExtensionInfo>> {
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

                if (ext.type === EXTENSION_TYPES.STATIC && !isValidUrl(ext.main)) {
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
