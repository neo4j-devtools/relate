import fse from 'fs-extra';
import path from 'path';
import {List} from '@relate/types';

import {IDbmsPluginSource, IDbmsPluginVersion, DbmsPluginSourceModel} from '../../models';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {NotFoundError, NotSupportedError} from '../../errors';
import {DbmsPluginsAbstract} from './dbms-plugins.abstract';
import {discoverPluginSources, fetchOfficialPluginSources} from '../../utils/dbms-plugins';
import {LocalEnvironment} from '../environments';
import {JSON_FILE_EXTENSION} from '../../constants';

export class LocalDbmsPlugins extends DbmsPluginsAbstract<LocalEnvironment> {
    public async getSource(name: string): Promise<IDbmsPluginSource> {
        const sourcePath = path.join(this.environment.dirPaths.pluginSources, `${name}${JSON_FILE_EXTENSION}`);

        try {
            const sourceRaw = await fse.readJSON(sourcePath);
            const source = new DbmsPluginSourceModel(sourceRaw);

            return source;
        } catch {
            throw new NotFoundError(`Plugin source for "${name}" not found`);
        }
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

    public async addSources(sources: IDbmsPluginSource[]): Promise<List<IDbmsPluginSource>> {
        const mappedSources = List.from(sources).mapEach((source) => new DbmsPluginSourceModel(source));

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

    public install(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${LocalDbmsPlugins.name} does not support installing plugins`);
    }

    public upgrade(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${LocalDbmsPlugins.name} does not support upgrading plugins`);
    }

    public uninstall(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${LocalDbmsPlugins.name} does not support uninstalling plugins`);
    }
}
