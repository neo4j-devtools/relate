import fse from 'fs-extra';
import path from 'path';
import {List} from '@relate/types';

import {IDbmsPluginSource, IDbmsPluginVersion, DbmsPluginSourceModel} from '../../models';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {NotFoundError, NotSupportedError, TargetExistsError} from '../../errors';
import {DbmsPluginsAbstract} from './dbms-plugins.abstract';
import {
    discoverPluginSources,
    fetchOfficialPluginSources,
    getLatestCompatibleVersion,
    listVersions,
    updateDbmsConfig,
} from '../../utils/dbms-plugins';
import {LocalEnvironment, NEO4J_PLUGIN_DIR} from '../environments';
import {JSON_FILE_EXTENSION, PLUGINS_DIR_NAME} from '../../constants';
import {download, envPaths} from '../../utils';
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

    public list(
        _dbmsNameOrId: string,
        _filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IDbmsPluginVersion>> {
        throw new NotSupportedError(`${LocalDbmsPlugins.name} does not support listing plugins`);
    }

    public async install(
        dbmsNamesOrIds: string[] | List<string>,
        pluginName: string,
    ): Promise<List<IDbmsPluginVersion>> {
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
                    `${pluginSource.name}-${pluginToInstall.version}.jar`,
                );

                const downloadedFilePath = await download(pluginToInstall.downloadUrl, pluginCacheDir);
                if (pluginToInstall.sha256) {
                    await verifyHash(pluginToInstall.sha256, downloadedFilePath, 'sha256');
                }
                await fse.move(downloadedFilePath, pluginFilePath);

                const config = await this.environment.dbmss.getDbmsConfig(dbms.id);
                updateDbmsConfig(config, pluginToInstall.config);
                await config.flush();

                return pluginToInstall;
            })
            .unwindPromises();
    }

    public upgrade(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${LocalDbmsPlugins.name} does not support upgrading plugins`);
    }

    public uninstall(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${LocalDbmsPlugins.name} does not support uninstalling plugins`);
    }
}
