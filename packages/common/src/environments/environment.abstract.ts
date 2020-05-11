import {IAuthToken} from 'tapestry';

import {EnvironmentConfigModel, IDbms, IDbmsVersion, IEnvironmentAuth} from '../models';

export abstract class EnvironmentAbstract {
    get id(): string {
        return this.config.id;
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

    abstract getAppUrl(_appName: string): Promise<string>;
}
