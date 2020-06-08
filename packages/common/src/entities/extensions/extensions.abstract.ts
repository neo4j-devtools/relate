import {List} from '@relate/types';

import {IExtensionMeta, IExtensionVersion} from '../../utils/extensions';
import {EnvironmentAbstract} from '../environments';

export abstract class ExtensionsAbstract<Env extends EnvironmentAbstract> {
    constructor(protected readonly environment: Env) {}

    abstract getAppPath(appName: string, appRoot?: string): Promise<string>;

    abstract list(): Promise<List<IExtensionMeta>>;

    abstract link(filePath: string): Promise<IExtensionMeta>;

    abstract versions(): Promise<List<IExtensionVersion>>;

    abstract install(name: string, version: string): Promise<IExtensionMeta>;

    abstract uninstall(name: string): Promise<List<IExtensionMeta>>;
}
