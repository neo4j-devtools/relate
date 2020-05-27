import {ApolloLink, execute, FetchResult, GraphQLRequest, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {IAuthToken} from '@huboneo/tapestry';
import fetch from 'node-fetch';
import gql from 'graphql-tag';
import path from 'path';
import _ from 'lodash';
import {google} from 'googleapis';

import {AuthenticationError, InvalidConfigError, NotAllowedError, NotFoundError, NotSupportedError} from '../errors';
import {
    EnvironmentConfigModel,
    IDbms,
    IDbmsInfo,
    IDbmsVersion,
    IEnvironmentAuth,
} from '../models/environment-config.model';
import {EnvironmentAbstract} from './environment.abstract';
import {oAuthRedirectServer} from './oauth-utils';
import {envPaths} from '../utils';
import {AUTH_TOKEN_KEY, GOOGLE_AUTHENTICATION_CLIENT_ID, GOOGLE_AUTHENTICATION_CLIENT_SECRET} from '../constants';
import {ENVIRONMENTS_DIR_NAME, LOCALHOST_IP_ADDRESS} from './environment.constants';
import {ensureDirs} from '../system';
import {TokenService} from '../token.service';
import {IExtensionMeta, IExtensionVersion} from './local.environment/utils';

export class RemoteEnvironment extends EnvironmentAbstract {
    static readonly AUTH_REDIRECT_HOST = LOCALHOST_IP_ADDRESS;

    static readonly AUTH_REDIRECT_PORT = '5555';

    static readonly LOCAL_AUTH_SERVER = `http://${RemoteEnvironment.AUTH_REDIRECT_HOST}:${RemoteEnvironment.AUTH_REDIRECT_PORT}`;

    private oauth2Client: any;

    private client: ApolloLink;

    private relateUrl = `${this.httpOrigin}/graphql`;

    private readonly authUrl: string;

    private readonly dirPaths = {
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
    }

    constructor(config: EnvironmentConfigModel, configPath: string) {
        super(config, configPath);

        this.oauth2Client = new google.auth.OAuth2({
            clientId: GOOGLE_AUTHENTICATION_CLIENT_ID,
            clientSecret: GOOGLE_AUTHENTICATION_CLIENT_SECRET,
            redirectUri: RemoteEnvironment.LOCAL_AUTH_SERVER,
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.client = createHttpLink({
            // HttpLink wants a fetch implementation to make requests to a
            // GraphQL API. It wants the browser version of it which has a
            // few more options than the node version.
            credentials: 'include',
            fetch: (url: string, opts: any) => {
                // @todo: this could definitely be done better
                const options = _.merge({}, opts, {
                    credentials: 'include',
                    headers: {[AUTH_TOKEN_KEY]: this.config.authToken},
                    mode: 'cors',
                });

                return fetch(url, options);
            },
            uri: this.relateUrl,
        });

        this.authUrl = `${this.httpOrigin}/authentication/authenticate`;
    }

    private async graphql(operation: GraphQLRequest): Promise<FetchResult<{[key: string]: any}>> {
        if (!this.config.authToken) {
            throw new NotAllowedError('Unauthorized: must login to perform this operation');
        }

        if (!this.config.httpOrigin) {
            throw new InvalidConfigError('Environments must specify a `httpOrigin`');
        }

        try {
            const res = await makePromise(execute(this.client, operation));

            if (res.errors) {
                // @todo figure out handling when GraphQL returns multiple errors
                throw new Error(res.errors[0].message);
            }

            return res;
        } catch (err) {
            if (err.statusCode === 401 || err.statusCode === 403) {
                throw new NotAllowedError('Unauthorized: must login to perform this operation');
            }

            throw err;
        }
    }

    async login(redirectTo?: string): Promise<IEnvironmentAuth> {
        const redirect =
            redirectTo || `http://${RemoteEnvironment.AUTH_REDIRECT_HOST}:${RemoteEnvironment.AUTH_REDIRECT_PORT}`;

        return {
            authUrl: `${this.authUrl}?redirectTo=${redirect}`,
            getToken: async (): Promise<{authToken: string; redirectTo?: string}> => {
                const code = await oAuthRedirectServer({
                    host: RemoteEnvironment.AUTH_REDIRECT_HOST,
                    port: RemoteEnvironment.AUTH_REDIRECT_PORT,
                });
                const authToken = await this.generateAuthToken(code);

                return {
                    authToken,
                    redirectTo,
                };
            },
        };
    }

    async generateAuthToken(code: string): Promise<string> {
        const {tokens} = await this.oauth2Client.getToken({code});

        if (!tokens.id_token) {
            throw new AuthenticationError('Login failed: Unable to extract id token');
        }

        await this.oauth2Client.verifyIdToken({
            audience: GOOGLE_AUTHENTICATION_CLIENT_ID,
            idToken: tokens.id_token,
        });

        return TokenService.sign(tokens);
    }

    verifyAuthToken(token: string): Promise<void> {
        return fetch(`${this.httpOrigin}/authentication/verify`, {
            headers: {
                [AUTH_TOKEN_KEY]: token,
            },
            method: 'POST',
        }).then((res) => {
            if (!res.ok) {
                throw new AuthenticationError(`${res.status}: ${res.statusText}`);
            }
        });
    }

    updateDbmsConfig(_dbmsId: string, _properties: Map<string, string>): Promise<void> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support updating DBMS configs`);
    }

    listDbmsVersions(): Promise<IDbmsVersion[]> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support listing DBMS versions`);
    }

    async installDbms(name: string, credentials: string, version: string): Promise<string> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation InstallDbms(
                    $environmentId: String!
                    $name: String!
                    $credentials: String!
                    $version: String!
                ) {
                    installDbms(
                        environmentId: $environmentId
                        name: $name
                        credentials: $credentials
                        version: $version
                    )
                }
            `,
            variables: {
                credentials,
                environmentId: this.config.relateEnvironment,
                name,
                version,
            },
        });

        return data.installDbms;
    }

    async uninstallDbms(name: string): Promise<void> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation UninstallDbms($environmentId: String!, $name: String!) {
                    uninstallDbms(environmentId: $environmentId, name: $name)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                name,
            },
        });

        return data.uninstallDbms;
    }

    async getDbms(nameOrId: string): Promise<IDbms> {
        const {data}: any = await this.graphql({
            query: gql`
                query GetDbms($environmentId: String!, $nameOrId: String!) {
                    getDbms(environmentId: $environmentId, dbmsId: $nameOrId) {
                        id
                        name
                        description
                        connectionUri
                    }
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                nameOrId,
            },
        });

        const dbms = data.getDbms;

        if (!this.config.httpOrigin) {
            throw new InvalidConfigError('Remote Environments must specify a `relateURL`');
        }

        // @todo this is not 100% reliable as the DBMS might be hosted on a
        // different domain.
        const relateUrl = new URL(this.config.httpOrigin);
        const connectionUri = new URL(dbms.connectionUri);
        connectionUri.hostname = relateUrl.hostname;
        dbms.connectionUri = connectionUri.toString();

        return dbms;
    }

    async listDbmss(): Promise<IDbms[]> {
        const {data}: any = await this.graphql({
            query: gql`
                query ListDbmss($environmentId: String!) {
                    listDbmss(environmentId: $environmentId) {
                        id
                        name
                        description
                        connectionUri
                    }
                }
            `,
            variables: {environmentId: this.config.relateEnvironment},
        });

        return data.listDbmss;
    }

    async startDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation StartDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    startDbmss(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        return data.startDbmss;
    }

    async stopDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation StopDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    stopDbmss(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        return data.stopDbmss;
    }

    async infoDbmss(namesOrIds: string[]): Promise<IDbmsInfo[]> {
        const {data}: any = await this.graphql({
            query: gql`
                query InfoDBMSs($environmentId: String!, $namesOrIds: [String!]!) {
                    infoDbmss(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        return data.infoDbmss;
    }

    async createAccessToken(appId: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation AccessDBMS(
                    $environmentId: String!
                    $dbmsNameOrId: String!
                    $authToken: AuthTokenInput!
                    $appId: String!
                ) {
                    createAccessToken(
                        environmentId: $environmentId
                        dbmsId: $dbmsNameOrId
                        appId: $appId
                        authToken: $authToken
                    )
                }
            `,
            variables: {
                appId,
                authToken,
                dbmsNameOrId,
                environmentId: this.config.relateEnvironment,
            },
        });

        return data.createAccessToken;
    }

    async getAppPath(appName: string): Promise<string> {
        const installed: any = await this.listInstalledApps();
        const app = _.find(installed, ({name}) => name === appName);

        if (!app) {
            throw new NotFoundError(`App ${appName} not found`);
        }

        return app.path;
    }

    async listInstalledApps(): Promise<IExtensionMeta[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                query InstalledApps {
                    installedApps {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new NotSupportedError('Unable to list installed apps');
        }

        return data.installedApps;
    }

    listInstalledExtensions(): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support listing installed extensions`);
    }

    linkExtension(_filePath: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support linking extensions`);
    }

    installExtension(_name: string, _version: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support installing extensions`);
    }

    listExtensionVersions(): Promise<IExtensionVersion[]> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support listing extension versions`);
    }

    uninstallExtension(_name: string): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support uninstalling extensions`);
    }
}
