import {exec} from 'child_process';
import fse from 'fs-extra';
import {coerce} from 'semver';
import {promisify} from 'util';
import path from 'path';
import {List, None, Dict} from '@relate/types';

import {
    AmbiguousTargetError,
    InvalidArgumentError,
    NotSupportedError,
    NotFoundError,
    ExtensionExistsError,
} from '../errors';
import {EXTENSION_TYPES, HOOK_EVENTS} from '../constants';
import {emitHookEvent} from '../utils';
import {isValidUrl} from '../utils/generic';
import {
    getAppBasePath,
    discoverExtension,
    IExtensionMeta,
    discoverExtensionDistributions,
    extractExtension,
    downloadExtension,
    IExtensionVersion,
    fetchExtensionVersions,
} from '../utils/extensions';
import {ExtensionsAbstract} from './extensions.abstract';
import {LocalEnvironment} from '../environments/local.environment';

export class LocalExtensions extends ExtensionsAbstract<LocalEnvironment> {
    async getAppPath(appName: string, appRoot = ''): Promise<string> {
        const appBase = await getAppBasePath(appName);

        return `${appRoot}${appBase}`;
    }

    versions(): Promise<List<IExtensionVersion>> {
        return fetchExtensionVersions();
    }

    async list(): Promise<List<IExtensionMeta>> {
        const allInstalledExtensions = await Dict.from(EXTENSION_TYPES)
            .values.mapEach((type) =>
                discoverExtensionDistributions(path.join(this.environment.dirPaths.extensionsData, type)),
            )
            .unwindPromises();

        return allInstalledExtensions.flatten();
    }

    async link(filePath: string): Promise<IExtensionMeta> {
        const extension = await discoverExtension(filePath);
        const target = path.join(this.environment.dirPaths.extensionsData, extension.type, extension.name);

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.symlink(filePath, target);

        return extension;
    }

    async install(name: string, version: string): Promise<IExtensionMeta> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        const {extensionsCache, extensionsData} = this.environment.dirPaths;

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

                return this.installRelateExtension(discovered, extensionsData, discovered.dist);
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

            return this.installRelateExtension(requestedDistribution, extensionsData, requestedDistribution.dist);
        }

        throw new InvalidArgumentError('Provided version argument is not valid semver, url or path.');
    }

    private async installRelateExtension(
        extension: IExtensionMeta,
        extensionsDir: string,
        extractedDistPath: string,
    ): Promise<IExtensionMeta> {
        const target = path.join(extensionsDir, extension.type, extension.name);

        if (!(await fse.pathExists(extractedDistPath))) {
            throw new AmbiguousTargetError(`Path to extension does not exist "${extractedDistPath}"`);
        }

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.copy(extractedDistPath, target);

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

                return ext;
            })
            .unwindPromises();
    }
}
