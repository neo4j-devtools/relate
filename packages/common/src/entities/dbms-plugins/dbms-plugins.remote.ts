import {List} from '@relate/types';

import {IDbmsPluginSource, IDbmsPluginVersion} from '../../models';
import {IRelateFilter} from '../../utils/generic';
import {NotSupportedError} from '../../errors';
import {DbmsPluginsAbstract} from './dbms-plugins.abstract';
import {RemoteEnvironment} from '../environments';

export class RemoteDbmsPlugins extends DbmsPluginsAbstract<RemoteEnvironment> {
    public getSource(_name: string): Promise<IDbmsPluginSource> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support getting plugin sources`);
    }

    public listSources(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbmsPluginSource>> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support listing plugin sources`);
    }

    public addSources(_sources: List<IDbmsPluginSource> | IDbmsPluginSource[]): Promise<List<IDbmsPluginSource>> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support adding plugin sources`);
    }

    public removeSources(_names: string[]): Promise<List<IDbmsPluginSource>> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support removing plugin sources`);
    }

    public list(
        _dbmsNameOrId: string,
        _filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IDbmsPluginVersion>> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support listing plugins`);
    }

    public install(_dbmsNamesOrIds: string[] | List<string>, _pluginName: string): Promise<List<IDbmsPluginVersion>> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support installing plugins`);
    }

    public upgrade(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support upgrading plugins`);
    }

    public uninstall(_dbmsNameOrId: string, _pluginName: string): Promise<IDbmsPluginVersion> {
        throw new NotSupportedError(`${RemoteDbmsPlugins.name} does not support uninstalling plugins`);
    }
}
