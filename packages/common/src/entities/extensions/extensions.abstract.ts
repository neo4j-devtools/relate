import {List} from '@relate/types';

import {IExtensionVersion} from '../../utils/extensions';
import {EnvironmentAbstract} from '../environments';
import {IRelateFilter} from '../../utils/generic';
import {IAppLaunchToken, IExtensionInfo} from '../../models';

export abstract class ExtensionsAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * Gets path to app entry point
     * @param   appName
     * @param   appRoot
     */
    abstract getAppPath(appName: string, appRoot?: string): Promise<string>;

    /**
     * List all installed extensions
     * @param   filters     Filters to apply
     */
    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionInfo>>;

    /**
     * List all installed apps
     * @param   filters     Filters to apply
     */
    abstract listApps(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionInfo>>;

    /**
     * Link local extension (useful for development)
     * @param   filePath
     */
    abstract link(filePath: string): Promise<IExtensionInfo>;

    /**
     * List all available extensions to install
     * @param   filters     Filters to apply
     */
    abstract versions(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionVersion>>;

    /**
     * Install given extension
     * @param   name
     * @param   version
     */
    abstract install(name: string, version: string): Promise<IExtensionInfo>;

    /**
     * Uninstall given extension
     * @param   name
     */
    abstract uninstall(name: string): Promise<List<IExtensionInfo>>;

    /**
     * Creates an app launch token, for passing DBMS info and credentials to app
     * @param   appName         Installed app to create token for
     * @param   dbmsId
     * @param   principal       DBMS principal
     * @param   accessToken     DBMS access token
     * @param   projectId
     */
    abstract createAppLaunchToken(
        appName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
        projectId?: string,
    ): Promise<string>;

    /**
     * Decodes app launch token
     * @param   appName
     * @param   launchToken
     */
    abstract parseAppLaunchToken(appName: string, launchToken: string): Promise<IAppLaunchToken>;
}
