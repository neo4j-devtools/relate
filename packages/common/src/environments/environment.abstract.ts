import fse from 'fs-extra';
import {IAuthToken} from '@huboneo/tapestry';
import _ from 'lodash';

import {EnvironmentConfigModel, IDbms, IDbmsVersion, IEnvironmentAuth} from '../models';
import {IDbmsInfo} from '../models/environment-config.model';
import {AUTHENTICATOR_TYPES, DEFAULT_ENVIRONMENT_HTTP_ORIGIN, ENVIRONMENT_TYPES} from './environment.constants';
import {IExtensionMeta, IExtensionVersion} from './local.environment/utils';
import {
    googleAuthenticatorFactory,
    IAuthenticator,
    IAuthenticatorOptions,
    IGoogleAuthenticatorOptions,
} from './authenticators';
import {NotSupportedError} from '../errors';
import {arrayHasItems} from '../utils';

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

    private authenticator?: IAuthenticator;

    constructor(protected config: EnvironmentConfigModel, protected readonly configFilePath: string) {
        if (config.authenticator) {
            // @todo: move to init?
            this.setupAuthenticator({
                httpOrigin: this.httpOrigin,
                ...config.authenticator,
            });
        }
    }

    private setupAuthenticator(options: IAuthenticatorOptions) {
        switch (options.type) {
            case AUTHENTICATOR_TYPES.GOOGLE_OAUTH2: {
                this.authenticator = googleAuthenticatorFactory(options as IGoogleAuthenticatorOptions);
                return;
            }

            default: {
                throw new NotSupportedError(`Authenticator type ${options.type} not supported`);
            }
        }
    }

    init(): Promise<void> {
        return Promise.resolve();
    }

    login(redirectTo?: string): Promise<IEnvironmentAuth> {
        if (!this.authenticator) {
            throw new NotSupportedError(`Environment ${this.id} does not support login.`);
        }

        return this.authenticator.login(redirectTo);
    }

    generateAuthToken(code = ''): Promise<string> {
        if (!this.authenticator) {
            return Promise.resolve('');
        }

        return this.authenticator.generateAuthToken(code);
    }

    verifyAuthToken(token = ''): Promise<void> {
        if (!this.authenticator) {
            return Promise.resolve();
        }

        return this.authenticator.verifyAuthToken(token);
    }

    supports(methodName: string): boolean {
        const {allowedMethods} = this.config;

        if (!arrayHasItems(allowedMethods)) {
            return true;
        }

        return _.includes(allowedMethods, methodName);
    }

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

    abstract listExtensionVersions(): Promise<IExtensionVersion[]>;

    abstract installExtension(name: string, version: string): Promise<IExtensionMeta>;

    abstract uninstallExtension(name: string): Promise<IExtensionMeta[]>;

    async updateConfig(key: string, value: any): Promise<void> {
        const config = await fse.readJSON(this.configFilePath, {encoding: 'utf8'});

        config[key] = value;

        await fse.writeJSON(this.configFilePath, config, {encoding: 'utf8'});
    }
}
