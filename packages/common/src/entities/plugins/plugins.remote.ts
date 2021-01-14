import {List} from '@relate/types';

import {IPluginSource, IPluginVersion} from '../../models';
import {IRelateFilter} from '../../utils/generic';
import {NotSupportedError} from '../../errors';
import {PluginsAbstract} from './plugins.abstract';
import {RemoteEnvironment} from '../environments';

export class RemotePlugins extends PluginsAbstract<RemoteEnvironment> {
    public listSources(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IPluginSource>> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support listing plugin sources`);
    }

    public addSources(_urls: string[]): Promise<IPluginSource> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support adding plugin sources`);
    }

    public removeSources(_urls: string[]): Promise<IPluginSource> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support removing plugin sources`);
    }

    public list(
        _dbmsNameOrId: string,
        _filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IPluginVersion>> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support listing plugins`);
    }

    public install(_dbmsNameOrId: string, _pluginName: string): Promise<IPluginVersion> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support installing plugins`);
    }

    public upgrade(_dbmsNameOrId: string, _pluginName: string): Promise<IPluginVersion> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support upgrading plugins`);
    }

    public uninstall(_dbmsNameOrId: string, _pluginName: string): Promise<IPluginVersion> {
        throw new NotSupportedError(`${RemotePlugins.name} does not support uninstalling plugins`);
    }
}
