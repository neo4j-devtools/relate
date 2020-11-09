import fse from 'fs-extra';
import {List} from '@relate/types';

import {EnvironmentConfigModel, IEnvironmentAuth, GoogleAuthenticationModel} from '../../models';
import {DEFAULT_ENVIRONMENT_HTTP_ORIGIN, ENVIRONMENT_TYPES} from './environment.constants';
import {
    AUTHENTICATOR_TYPES,
    GoogleAuthentication,
    ClientAuthentication,
    IGoogleAuthenticationOptions,
    IAuthentication,
} from './authentication';
import {NotSupportedError} from '../../errors';
import {arrayHasItems} from '../../utils/generic';
import {DbmssAbstract} from '../dbmss';
import {DbsAbstract} from '../dbs';
import {ExtensionsAbstract} from '../extensions';
import {ProjectsAbstract} from '../projects';
import {BackupAbstract} from '../backups';
import {envPaths} from '../../utils';
import {ENTITY_TYPES, PUBLIC_GRAPHQL_METHODS} from '../../constants';
import path from 'path';

export abstract class EnvironmentAbstract {
    public readonly dbmss!: DbmssAbstract<EnvironmentAbstract>;

    public readonly dbs!: DbsAbstract<EnvironmentAbstract>;

    public readonly extensions!: ExtensionsAbstract<EnvironmentAbstract>;

    public readonly projects!: ProjectsAbstract<EnvironmentAbstract>;

    public readonly backups!: BackupAbstract<EnvironmentAbstract>;

    /**
     * @hidden
     */
    public readonly dirPaths!: {[key: string]: string};

    private readonly authentication = this.getAuthentication();

    get id(): string {
        return this.config.id;
    }

    get name(): string {
        return this.config.name;
    }

    /**
     * Indicates if environment is current active
     */
    get isActive(): boolean {
        return Boolean(this.config.active);
    }

    get type(): ENVIRONMENT_TYPES {
        return this.config.type;
    }

    get httpOrigin(): string {
        return this.config.httpOrigin || DEFAULT_ENVIRONMENT_HTTP_ORIGIN;
    }

    get requiresAPIToken(): boolean {
        return Boolean(this.config.serverConfig?.requiresAPIToken);
    }

    /**
     * @hidden
     */
    get configPath(): string {
        return this.config.configPath;
    }

    /**
     * @hidden
     */
    get remoteEnvironmentId(): string | undefined {
        return this.config.remoteEnvironmentId;
    }

    /**
     * @hidden
     */
    public get cachePath(): string {
        return envPaths().cache;
    }

    /**
     * @hidden
     */
    public get dataPath(): string {
        return this.config.relateDataPath || path.join(envPaths().data, `${ENTITY_TYPES.ENVIRONMENT}-${this.id}`);
    }

    /**
     * @hidden
     */
    constructor(protected config: EnvironmentConfigModel) {}

    private getAuthentication(): IAuthentication | undefined {
        const {authentication} = this.config;

        if (!authentication) {
            return undefined;
        }

        switch (authentication.type) {
            case AUTHENTICATOR_TYPES.GOOGLE_OAUTH2: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const authOptions: IGoogleAuthenticationOptions = authentication;
                const googleOptions = new GoogleAuthenticationModel(authOptions);

                return new GoogleAuthentication(this, googleOptions);
            }

            case AUTHENTICATOR_TYPES.CLIENT: {
                return new ClientAuthentication(this);
            }

            default: {
                throw new NotSupportedError(`Authenticator type ${authentication.type} not supported`);
            }
        }
    }

    /**
     * Environment initialisation logic
     */
    abstract init(): Promise<void>;

    /**
     * Generates an API token
     * @param   hostName    host name of token request
     * @param   clientId    client ID of token request
     * @param   data        API token data
     * @return              token
     */
    abstract generateAPIToken(hostName: string, clientId: string, data: any): Promise<string>;

    /**
     * Verifies an API token
     * @param   hostName    host name of token request
     * @param   clientId    client ID of token request
     * @param   token       token to verify
     */
    abstract verifyAPIToken(hostName: string, clientId: string, token?: string): Promise<void>;

    /**
     * Environment Authentication logic
     */
    login(redirectTo?: string): Promise<IEnvironmentAuth> {
        if (!this.authentication) {
            throw new NotSupportedError(`Environment ${this.id} does not support login.`);
        }

        return this.authentication.login(redirectTo);
    }

    /**
     * Generates an authentication token
     * @param   data    authentication response data
     * @return          token
     */
    generateAuthToken(data: any): Promise<string> {
        if (!this.authentication) {
            return Promise.resolve('');
        }

        return this.authentication.generateAuthToken(data);
    }

    /**
     * Verifies an authentication token
     * @param   token                   token to verify
     * @throws  AuthenticationError
     */
    verifyAuthToken(token = ''): Promise<void> {
        if (!this.authentication) {
            return Promise.resolve();
        }

        return this.authentication.verifyAuthToken(token);
    }

    /**
     * Checks if given GraphQL method is supported
     * @param   methodName
     */
    supports(methodName: PUBLIC_GRAPHQL_METHODS): boolean {
        const {serverConfig: {publicGraphQLMethods} = {}} = this.config;

        if (!arrayHasItems(publicGraphQLMethods)) {
            return true;
        }

        return List.from(publicGraphQLMethods).includes(methodName);
    }

    /**
     * Gets config value for given key
     */
    getConfigValue<K extends keyof EnvironmentConfigModel>(key: K): Promise<EnvironmentConfigModel[K]> {
        return Promise.resolve(this.config[key]);
    }

    /**
     * Reloads config from disk
     */
    async reloadConfig(): Promise<void> {
        const config = await fse.readJSON(this.configPath, {encoding: 'utf8'});

        this.config = new EnvironmentConfigModel({
            ...config,
            configPath: this.configPath,
        });
    }

    /**
     * Updates config on disk
     */
    async updateConfig(key: string, value: any): Promise<void> {
        const config = await fse.readJSON(this.configPath, {encoding: 'utf8'});

        config[key] = value;

        await fse.writeJSON(this.configPath, config, {encoding: 'utf8'});
        await this.reloadConfig();
    }
}
