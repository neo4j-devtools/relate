import {promises as fs} from 'fs';
import fse from 'fs-extra';
import path from 'path';
import semver from 'semver';
import {List} from '@relate/types';

import {IDbmsPluginSource, DbmsPluginSourceModel, IDbmsPluginInstalled} from '../../models';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {NotFoundError, TargetExistsError} from '../../errors';
import {DbmsPluginsAbstract} from './dbms-plugins.abstract';
import {
    discoverPluginSources,
    fetchOfficialPluginSources,
    getLatestCompatibleVersion,
    listVersions,
    updateDbmsConfig,
} from '../../utils/dbms-plugins';
import {LocalEnvironment, NEO4J_PLUGIN_DIR} from '../environments';
import {HOOK_EVENTS, JSON_FILE_EXTENSION, PLUGINS_DIR_NAME} from '../../constants';
import {download, emitHookEvent, envPaths} from '../../utils';
import {verifyHash} from '../../utils/download';

export class LocalDbmsPlugins extends DbmsPluginsAbstract<LocalEnvironment> {
    public async getSource(name: string): Promise<IDbmsPluginSource> {
        if (this.sources[name]) {
            return this.sources[name];
        }

        await this.listSources();
        if (this.sources[name]) {
            return this.sources[name];
        }

        throw new NotFoundError(`Source for plugin "${name}" not found`);
    }

    public async listSources(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbmsPluginSource>> {
        const official = await fetchOfficialPluginSources();
        const userSaved = await discoverPluginSources(this.environment.dirPaths.pluginSources);
        const allSources = official.concat(userSaved);

        this.sources = allSources.reduce((agg, source) => {
            return {
                ...agg,
                [source.name]: source,
            };
        }, {});

        return applyEntityFilters(allSources, filters);
    }

    public async addSources(sources: List<IDbmsPluginSource> | IDbmsPluginSource[]): Promise<List<IDbmsPluginSource>> {
        const allSources = await this.listSources();
        const namesToBeAdded = List.from(sources).mapEach((source) => source.name);
        const existingSources = allSources.filter((source) => namesToBeAdded.includes(source.name));

        if (existingSources.length.greaterThan(0)) {
            const names = existingSources.mapEach((source) => source.name);
            throw new TargetExistsError(`The following dbms plugin sources already exist: ${names.join(', ')}`);
        }

        const mappedSources = List.from(sources)
            .mapEach(
                (source) =>
                    new DbmsPluginSourceModel({
                        ...source,
                        isOfficial: false,
                    }),
            )
            .compact();

        await mappedSources
            .mapEach(async (source) => {
                const sourcePath = path.join(
                    this.environment.dirPaths.pluginSources,
                    `${source.name}${JSON_FILE_EXTENSION}`,
                );

                await fse.writeJSON(sourcePath, source);
            })
            .unwindPromises();

        return mappedSources;
    }

    public async removeSources(names: string[]): Promise<List<IDbmsPluginSource>> {
        const sourcesList = await this.listSources();
        const removedSources = sourcesList.filter((source) => names.includes(source.name) && !source.isOfficial);

        await removedSources
            .mapEach(async (source) => {
                const sourcePath = path.join(
                    this.environment.dirPaths.pluginSources,
                    `${source.name}${JSON_FILE_EXTENSION}`,
                );

                await fse.remove(sourcePath);
            })
            .unwindPromises();

        return removedSources;
    }

    public async list(
        dbmsNameOrId: string,
        filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IDbmsPluginInstalled>> {
        const dbms = await this.environment.dbmss.get(dbmsNameOrId);
        if (!dbms.rootPath) {
            throw new NotFoundError(`Could not find DBMS root path for "${dbms.name}"`);
        }

        const dbmsPluginsDir = path.join(dbms.rootPath, NEO4J_PLUGIN_DIR);
        const files = await fs.readdir(dbmsPluginsDir, {withFileTypes: true});

        const plugins = await List.from(files)
            .filter((file) => file.isFile() && path.extname(file.name) === '.jar')
            .mapEach(async (file) => {
                const splitFilename = path.basename(file.name, '.jar').split('-');
                const versionStr = splitFilename.pop();
                const name = splitFilename.join('-');

                if (!name || !versionStr || !semver.coerce(versionStr)) {
                    await emitHookEvent(HOOK_EVENTS.DEBUG, `Couldn't parse version from "${file.name}"`);
                    return null;
                }

                const source = await this.getSource(name).catch(async (err) => {
                    await emitHookEvent(HOOK_EVENTS.DEBUG, `Could not retrieve source for "${name}": ${err}`);
                    return null;
                });

                const allVersions = source?.versionsUrl
                    ? await listVersions(this.environment.dirPaths.pluginVersions, source)
                    : List.of([]);
                const version = allVersions
                    .find((v) => v.version === versionStr)
                    .getOrElse({
                        version: versionStr,
                    });

                return {
                    ...source,
                    name,
                    version,
                };
            })
            .unwindPromises();

        return applyEntityFilters(plugins.compact(), filters);
    }

    public async install(
        dbmsNamesOrIds: string[] | List<string>,
        pluginName: string,
    ): Promise<List<IDbmsPluginInstalled>> {
        const pluginSource = await this.getSource(pluginName);
        const pluginVersions = await listVersions(this.environment.dirPaths.pluginVersions, pluginSource);

        return List.from(dbmsNamesOrIds)
            .mapEach(async (dbmsNameOrId) => {
                const dbms = await this.environment.dbmss.get(dbmsNameOrId);
                const dbmsRootPath = dbms.rootPath;
                if (!dbmsRootPath) {
                    throw new NotFoundError(`Could not find DBMS root path for "${dbms.name}"`);
                }

                const pluginToInstall = getLatestCompatibleVersion(dbms, pluginSource, pluginVersions);

                const pluginCacheDir = path.join(envPaths().cache, PLUGINS_DIR_NAME);
                const pluginFilePath = path.join(
                    dbmsRootPath,
                    NEO4J_PLUGIN_DIR,
                    this.getDbmsPluginFilename({
                        ...pluginSource,
                        version: pluginToInstall,
                    }),
                );

                await emitHookEvent(HOOK_EVENTS.DOWNLOAD_START, null);
                const downloadedFilePath = await download(pluginToInstall.downloadUrl, pluginCacheDir);
                if (pluginToInstall.sha256) {
                    await verifyHash(pluginToInstall.sha256, downloadedFilePath, 'sha256');
                }
                await emitHookEvent(HOOK_EVENTS.DOWNLOAD_STOP, null);

                await fse.move(downloadedFilePath, pluginFilePath, {overwrite: true});

                const config = await this.environment.dbmss.getDbmsConfig(dbms.id);
                updateDbmsConfig(config, pluginToInstall.config);
                await config.flush();

                return {
                    ...pluginSource,
                    version: pluginToInstall,
                };
            })
            .unwindPromises();
    }

    public async uninstall(dbmsNamesOrIds: string[] | List<string>, pluginName: string): Promise<void> {
        await List.from(dbmsNamesOrIds)
            .mapEach(async (dbmsNameOrId) => {
                const dbms = await this.environment.dbmss.get(dbmsNameOrId);
                if (!dbms.rootPath) {
                    throw new NotFoundError(`Could not find DBMS root path for "${dbms.name}"`);
                }
                const dbmsPluginsDir = path.join(dbms.rootPath, NEO4J_PLUGIN_DIR);

                const pluginsToUninstall = await this.list(dbmsNameOrId, [
                    {
                        field: 'name',
                        value: pluginName,
                    },
                ]);

                // In most cases there shouldn't be multiple versions of the
                // same plugin, but it is possible for this to happen, so in
                // this case all versions of the plugin would be deleted.
                await pluginsToUninstall
                    .mapEach(async (plugin) => {
                        const filename = this.getDbmsPluginFilename(plugin);
                        const pluginPath = path.join(dbmsPluginsDir, filename);
                        const pluginPathExists = await fse.pathExists(pluginPath);

                        if (pluginPathExists) {
                            return fse.remove(pluginPath);
                        }

                        return emitHookEvent(
                            HOOK_EVENTS.DEBUG,
                            `cannot remove "${pluginPath}" because it does not exist`,
                        );
                    })
                    .unwindPromises();
            })
            .unwindPromises();
    }

    private getDbmsPluginFilename(plugin: IDbmsPluginInstalled): string {
        return `${plugin.name}-${plugin.version.version}.jar`;
    }
}
