import {List} from '@relate/types';

import {IExtensionMeta, IExtensionVersion} from '../../utils/extensions';
import {EnvironmentAbstract} from '../environments';
import {IRelateFilter} from '../../utils/generic';

export abstract class ExtensionsAbstract<Env extends EnvironmentAbstract> {
    constructor(protected readonly environment: Env) {}

    abstract getAppPath(appName: string, appRoot?: string): Promise<string>;

    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionMeta>>;

    abstract link(filePath: string): Promise<IExtensionMeta>;

    abstract versions(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionVersion>>;

    abstract install(name: string, version: string): Promise<IExtensionMeta>;

    abstract uninstall(name: string): Promise<List<IExtensionMeta>>;
}
