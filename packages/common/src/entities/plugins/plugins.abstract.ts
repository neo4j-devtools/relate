import {List} from '@relate/types';

import {IPluginSource, IPluginVersion} from '../../models';
import {IRelateFilter} from '../../utils/generic';
import {EnvironmentAbstract} from '../environments';

export abstract class PluginsAbstract<Env extends EnvironmentAbstract> {
    public sources: Record<string, IPluginSource> = {};

    public versions: Record<string, IPluginVersion[]> = {};

    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * List all plugin sources
     * @param   filters     Filters to apply
     */
    abstract listSources(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IPluginSource>>;

    /**
     * Add one or more plugin sources
     * @param   urls     List of source URLs
     */
    abstract addSources(urls: string[]): Promise<IPluginSource>;

    /**
     * Remove one or more plugin sources
     * @param   urls     List of source URLs
     */
    abstract removeSources(urls: string[]): Promise<IPluginSource>;

    /**
     * List all plugins installed in the specified DBMS
     * @param   dbmsNameOrId
     * @param   filters         Filters to apply
     */
    abstract list(dbmsNameOrId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IPluginVersion>>;

    /**
     * Install a plugin in the specified DBMS
     * @param   dbmsNameOrId
     * @param   pluginName
     */
    abstract install(dbmsNameOrId: string, pluginName: string): Promise<IPluginVersion>;

    /**
     * Upgrade a plugin in the specified DBMS
     * @param   dbmsNameOrId
     * @param   pluginName
     */
    abstract upgrade(dbmsNameOrId: string, pluginName: string): Promise<IPluginVersion>;

    /**
     * Uninstall a plugin from the specified DBMS
     * @param   dbmsNameOrId
     * @param   pluginName
     */
    abstract uninstall(dbmsNameOrId: string, pluginName: string): Promise<IPluginVersion>;
}
