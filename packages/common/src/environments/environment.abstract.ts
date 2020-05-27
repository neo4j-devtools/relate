import fse from 'fs-extra';
import {IAuthToken} from '@huboneo/tapestry';

import {EnvironmentConfigModel, IDbms, IDbmsVersion, IEnvironmentAuth} from '../models';
import {IDbmsInfo} from '../models/environment-config.model';
import {DEFAULT_ENVIRONMENT_HTTP_ORIGIN, ENVIRONMENT_TYPES} from './environment.constants';
import {IExtensionMeta} from '../utils';

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

    abstract login(redirectTo?: string): Promise<IEnvironmentAuth>;

    abstract generateAuthToken(token: string): Promise<string>;

    abstract verifyAuthToken(token: string): Promise<void>;

    abstract listDbmsVersions(): Promise<IDbmsVersion[]>;

    abstract installDbms(name: string, credentials: string, version: string): Promise<string>;

    abstract uninstallDbms(dbmsId: string): Promise<void>;

    abstract listDbmss(): Promise<IDbms[]>;

    abstract getDbms(nameOrId: string): Promise<IDbms>;

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract infoDbmss(dbmsIds: string[]): Promise<IDbmsInfo[]>;

    abstract createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string>;

    abstract updateDbmsConfig(dbmsId: string, properties: Map<string, string>): Promise<void>;

    abstract getAppPath(appName: string, appRoot?: string): Promise<string>;

    abstract listInstalledApps(): Promise<IExtensionMeta[]>;

    abstract listInstalledExtensions(): Promise<IExtensionMeta[]>;

    abstract linkExtension(filePath: string): Promise<IExtensionMeta>;

    abstract installExtension(name: string, version: string): Promise<IExtensionMeta>;

    abstract uninstallExtension(name: string): Promise<IExtensionMeta[]>;

    async updateConfig(key: string, value: any): Promise<void> {
        const config = await fse.readJSON(this.configFilePath, {encoding: 'utf8'});

        config[key] = value;

        await fse.writeJSON(this.configFilePath, config, {encoding: 'utf8'});
    }
}
