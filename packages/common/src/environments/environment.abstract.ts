import fse from 'fs-extra';
import {IAuthToken} from '@huboneo/tapestry';
import _ from 'lodash';

import {
    EnvironmentConfigModel,
    IDbms,
    IDbmsVersion,
    IEnvironmentAuth,
    IDbmsInfo,
    GoogleAuthenticatorModel,
} from '../models';
import {DEFAULT_ENVIRONMENT_HTTP_ORIGIN, ENVIRONMENT_TYPES} from './environment.constants';
import {IExtensionMeta, IExtensionVersion} from '../utils/environment';
import {
    AUTHENTICATOR_TYPES,
    googleAuthenticatorFactory,
    IAuthenticator,
    IAuthenticatorOptions,
    IGoogleAuthenticatorOptions,
} from './authenticators';
import {NotSupportedError} from '../errors';
import {arrayHasItems} from '../utils/generic';
import {PUBLIC_ENVIRONMENT_METHODS} from '../constants';

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
                const googleOptions = new GoogleAuthenticatorModel(options as IGoogleAuthenticatorOptions);
                this.authenticator = googleAuthenticatorFactory(googleOptions);
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

    abstract [PUBLIC_ENVIRONMENT_METHODS.LIST_DBMS_VERSIONS](): Promise<IDbmsVersion[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.INSTALL_DBMS](
        name: string,
        credentials: string,
        version: string,
    ): Promise<string>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.UNINSTALL_DBMS](dbmsId: string): Promise<void>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.LIST_DBMSS](): Promise<IDbms[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.GET_DBMS](nameOrId: string): Promise<IDbms>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.START_DBMSS](dbmsIds: string[]): Promise<string[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.STOP_DBMSS](dbmsIds: string[]): Promise<string[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.INFO_DBMSS](dbmsIds: string[]): Promise<IDbmsInfo[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.CREATE_ACCESS_TOKEN](
        appId: string,
        dbmsId: string,
        authToken: IAuthToken,
    ): Promise<string>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.UPDATE_DBMS_CONFIG](
        dbmsId: string,
        properties: Map<string, string>,
    ): Promise<boolean>;

    abstract getAppPath(appName: string, appRoot?: string): Promise<string>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.INSTALLED_APPS](): Promise<IExtensionMeta[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.INSTALLED_EXTENSIONS](): Promise<IExtensionMeta[]>;

    abstract linkExtension(filePath: string): Promise<IExtensionMeta>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.LIST_EXTENSION_VERSIONS](): Promise<IExtensionVersion[]>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.INSTALL_EXTENSION](name: string, version: string): Promise<IExtensionMeta>;

    abstract [PUBLIC_ENVIRONMENT_METHODS.UNINSTALL_EXTENSION](name: string): Promise<IExtensionMeta[]>;

    async updateConfig(key: string, value: any): Promise<void> {
        const config = await fse.readJSON(this.configFilePath, {encoding: 'utf8'});

        config[key] = value;

        await fse.writeJSON(this.configFilePath, config, {encoding: 'utf8'});
    }
}
