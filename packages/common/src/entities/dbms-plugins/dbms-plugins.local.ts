import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import {Dict, List} from '@relate/types';

import {IDbmsPluginSource, IDbmsPluginVersion, DbmsPluginSourceModel} from '../../models';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {NotFoundError, NotSupportedError} from '../../errors';
import {DbmsPluginsAbstract} from './dbms-plugins.abstract';
import {discoverPluginSources} from '../../utils/dbms-plugins';
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
        // @todo - should throttle this
        this.sources = await discoverPluginSources(this.environment.dirPaths.pluginSources);

        return applyEntityFilters(Dict.from(this.sources).values, filters);
    }

    public async addSources(urls: string[]): Promise<List<IDbmsPluginSource>> {
        const responses: List<IDbmsPluginSource> = await List.from(urls)
            .mapEach((url) => got(url).json())
            .unwindPromises();
        const sources = responses.mapEach((res) => new DbmsPluginSourceModel(res));

        await sources
            .mapEach(async (source) => {
                const sourcePath = path.join(
                    this.environment.dirPaths.pluginSources,
                    `${source.name}${JSON_FILE_EXTENSION}`,
                );

                await fse.writeJSON(sourcePath, source);
            })
            .unwindPromises();

        return sources;
    }

    public async removeSources(names: string[]): Promise<List<IDbmsPluginSource>> {
        const sources = await List.from(names)
            .mapEach((name) => this.getSource(name))
            .unwindPromises();

        await sources
            .mapEach(async (source) => {
                const sourcePath = path.join(
                    this.environment.dirPaths.pluginSources,
                    `${source.name}${JSON_FILE_EXTENSION}`,
                );

                await fse.remove(sourcePath);
            })
            .unwindPromises();

        return sources;
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
