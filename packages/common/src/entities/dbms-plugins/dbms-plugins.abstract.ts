import {List} from '@relate/types';

import {IDbmsPluginInstalled, IDbmsPluginSource, IDbmsPluginUpgradable, IDbmsPluginVersion} from '../../models';
import {IRelateFilter} from '../../utils/generic';
import {EnvironmentAbstract} from '../environments';

export abstract class DbmsPluginsAbstract<Env extends EnvironmentAbstract> {
    public sources: Record<string, IDbmsPluginSource> = {};

    public versions: Record<string, IDbmsPluginVersion[]> = {};

    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * Get the source for a plugin
     * @param   name
     */
    abstract getSource(name: string): Promise<IDbmsPluginSource>;

    /**
     * List all plugin sources
     * @param   filters     Filters to apply
     */
    abstract listSources(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbmsPluginSource>>;

    /**
     * Add one or more plugin sources
     * @param   sources     List of sources
     */
    abstract addSources(sources: List<IDbmsPluginSource> | IDbmsPluginSource[]): Promise<List<IDbmsPluginSource>>;

    /**
     * Remove one or more plugin sources
     * @param   urls     List of source URLs
     */
    abstract removeSources(names: string[]): Promise<List<IDbmsPluginSource>>;

    /**
     * List all plugins installed in the specified DBMS
     * @param   dbmsNameOrId
     * @param   filters         Filters to apply
     */
    abstract list(
        dbmsNameOrId: string,
        filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IDbmsPluginInstalled>>;

    /**
     * Preview plugin versions that would be installed if the DBMS
     * containing them would be upgraded.
     * @param   dbmsNameOrId
     * @param   dbmsTargetVersion         Version the DBMS would be upgraded to
     */
    abstract previewUpgrade(dbmsNameOrId: string, dbmsTargetVersion: string): Promise<List<IDbmsPluginUpgradable>>;

    /**
     * Install a plugin in the specified DBMS
     * @param   dbmsNamesOrIds
     * @param   pluginName
     */
    abstract install(dbmsNamesOrIds: string[] | List<string>, pluginName: string): Promise<List<IDbmsPluginInstalled>>;

    /**
     * Uninstall a plugin from the specified DBMS
     * @param   dbmsNameOrId
     * @param   pluginName
     */
    abstract uninstall(dbmsNamesOrIds: string[] | List<string>, pluginName: string): Promise<void>;
}
