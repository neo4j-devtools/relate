import fse from 'fs-extra';
import {List} from '@relate/types';

import {EnvironmentConfigModel, IEnvironmentAuth, GoogleAuthenticatorModel} from '../../models';
import {DEFAULT_ENVIRONMENT_HTTP_ORIGIN, ENVIRONMENT_TYPES} from './environment.constants';
import {
    AUTHENTICATOR_TYPES,
    googleAuthenticatorFactory,
    IAuthenticator,
    IAuthenticatorOptions,
    IGoogleAuthenticatorOptions,
} from './authenticators';
import {NotSupportedError} from '../../errors';
import {arrayHasItems} from '../../utils/generic';
import {DbmssAbstract} from '../dbmss';
import {ExtensionsAbstract} from '../extensions';
import {envPaths} from '../../utils';

export abstract class EnvironmentAbstract {
    public readonly dbmss!: DbmssAbstract<EnvironmentAbstract>;

    public readonly extensions!: ExtensionsAbstract<EnvironmentAbstract>;

    public readonly dirPaths!: {[key: string]: string};

    get id(): string {
        return this.config.id;
    }

    get active(): boolean {
        return Boolean(this.config.active);
    }

    get type(): ENVIRONMENT_TYPES {
        return this.config.type;
    }

    get httpOrigin(): string {
        return this.config.httpOrigin || DEFAULT_ENVIRONMENT_HTTP_ORIGIN;
    }

    get configPath(): string {
        return this.config.configPath;
    }

    get relateEnvironment(): string | undefined {
        return this.config.relateEnvironment;
    }

    public get neo4jDataPath(): string {
        return this.config.neo4jDataPath || envPaths().data;
    }

    private authenticator?: IAuthenticator;

    constructor(protected config: EnvironmentConfigModel) {
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

    abstract init(): Promise<void>;

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

        return List.from(allowedMethods).includes(methodName);
    }

    getConfigValue<K extends keyof EnvironmentConfigModel>(key: K): Promise<EnvironmentConfigModel[K]> {
        return Promise.resolve(this.config[key]);
    }

    async reloadConfig(): Promise<void> {
        const config = await fse.readJSON(this.configPath, {encoding: 'utf8'});

        this.config = new EnvironmentConfigModel({
            ...config,
            configPath: this.configPath,
        });
    }

    async updateConfig(key: string, value: any): Promise<void> {
        const config = await fse.readJSON(this.configPath, {encoding: 'utf8'});

        config[key] = value;

        await fse.writeJSON(this.configPath, config, {encoding: 'utf8'});
        await this.reloadConfig();
    }
}
