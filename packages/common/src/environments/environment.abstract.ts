import {IAuthToken} from '@huboneo/tapestry';

import {EnvironmentConfigModel, IDbms, IDbmsVersion, IEnvironmentAuth} from '../models';
import {DEFAULT_ENVIRONMENT_HTTP_ORIGIN, ENVIRONMENT_TYPES} from './environment.constants';

export abstract class EnvironmentAbstract {
    get id(): string {
        return this.config.id;
    }

    get type(): ENVIRONMENT_TYPES {
        return this.config.type;
    }

    get httpOrigin(): string {
        return this.config.httpOrigin || DEFAULT_ENVIRONMENT_HTTP_ORIGIN;
    }

    get configPath(): string {
        return this.configFilePath;
    }

    constructor(protected config: EnvironmentConfigModel, protected readonly configFilePath: string) {}

    init(): Promise<void> {
        return Promise.resolve();
    }

    abstract login(): Promise<IEnvironmentAuth>;

    abstract listDbmsVersions(): Promise<IDbmsVersion[]>;

    abstract installDbms(name: string, credentials: string, version: string): Promise<string>;

    abstract uninstallDbms(dbmsId: string): Promise<void>;

    abstract listDbmss(): Promise<IDbms[]>;

    abstract getDbms(nameOrId: string): Promise<IDbms>;

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string>;

    abstract updateDbmsConfig(dbmsId: string, properties: Map<string, string>): Promise<void>;

    abstract getAppPath(appName: string, appRoot?: string): Promise<string>;
}
