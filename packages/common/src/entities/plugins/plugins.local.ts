import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import {Dict, List} from '@relate/types';

import {IPluginSource, IPluginVersion, PluginSourceModel} from '../../models';
import {IRelateFilter} from '../../utils/generic';
import {NotFoundError, NotSupportedError} from '../../errors';
import {PluginsAbstract} from './plugins.abstract';
import {discoverPluginSources} from '../../utils/plugins';
import {LocalEnvironment} from '../environments';
import {JSON_FILE_EXTENSION} from '../../constants';

export class LocalPlugins extends PluginsAbstract<LocalEnvironment> {
    public async getSource(name: string): Promise<IPluginSource> {
        const sourcePath = path.join(this.environment.dirPaths.pluginSources, `${name}${JSON_FILE_EXTENSION}`);

        try {
            const sourceRaw = await fse.readJSON(sourcePath);
            const source = new PluginSourceModel(sourceRaw);

            return source;
        } catch {
            throw new NotFoundError(`Plugin source for "${name}" not found`);
        }
    }

    public async listSources(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IPluginSource>> {
        // Should throttle this
        this.sources = await discoverPluginSources(this.environment.dirPaths.pluginSources);

        return Dict.from(this.sources).values;
    }

    public async addSources(urls: string[]): Promise<List<IPluginSource>> {
        const responses: List<IPluginSource> = await List.from(urls)
            .mapEach((url) => got(url).json())
            .unwindPromises();
        const sources = responses.mapEach((res) => new PluginSourceModel(res));

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

    public async removeSources(names: string[]): Promise<List<IPluginSource>> {
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
    ): Promise<List<IPluginVersion>> {
        throw new NotSupportedError(`${LocalPlugins.name} does not support listing plugins`);
    }

    public install(_dbmsNameOrId: string, _pluginName: string): Promise<IPluginVersion> {
        throw new NotSupportedError(`${LocalPlugins.name} does not support installing plugins`);
    }

    public upgrade(_dbmsNameOrId: string, _pluginName: string): Promise<IPluginVersion> {
        throw new NotSupportedError(`${LocalPlugins.name} does not support upgrading plugins`);
    }

    public uninstall(_dbmsNameOrId: string, _pluginName: string): Promise<IPluginVersion> {
        throw new NotSupportedError(`${LocalPlugins.name} does not support uninstalling plugins`);
    }
}
