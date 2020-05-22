import {ApolloLink, execute, FetchResult, GraphQLRequest, makePromise} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {google} from 'googleapis';
import {IAuthToken} from '@huboneo/tapestry';
import fetch from 'node-fetch';
import gql from 'graphql-tag';
import path from 'path';
import fse from 'fs-extra';

import {InvalidConfigError, NotAllowedError} from '../errors';
import {EnvironmentConfigModel, IDbms, IDbmsVersion, IEnvironmentAuth} from '../models/environment-config.model';
import {EnvironmentAbstract} from './environment.abstract';
import {oAuthRedirectServer} from './oauth-utils';
import {JSON_FILE_EXTENSION} from '../constants';
import {envPaths} from '../utils';
import {ENVIRONMENTS_DIR_NAME} from './environment.constants';
import {ensureDirs} from '../system';

export class RemoteEnvironment extends EnvironmentAbstract {
    private client: ApolloLink;

    private readonly dirPaths = {
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
    }

    constructor(config: EnvironmentConfigModel, configPath: string) {
        super(config, configPath);

        this.client = new HttpLink({
            // HttpLink wants a fetch implementation to make requests to a
            // GraphQL API. It wants the browser version of it which has a
            // few more options than the node version.
            fetch: fetch as any,
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
            uri: this.config.relateURL,
        });
    }

    private async graphql(operation: GraphQLRequest): Promise<FetchResult<{[key: string]: any}>> {
        if (!this.config.accessToken) {
            throw new NotAllowedError('Unauthorized: must login to perform this operation');
        }

        if (!this.config.relateURL) {
            throw new InvalidConfigError('Remote Environments must specify a `relateURL`');
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

    async login(): Promise<IEnvironmentAuth> {
        const CLIENT_ID = '287762628639-t40b4jbvff0qecvb3iv7bep8fosfpbal.apps.googleusercontent.com';
        // According to this client_secret is not used as a secret in our case,
        // so it should be fine for it to be here.
        // https://developers.google.com/identity/protocols/oauth2#installed
        // https://tools.ietf.org/html/rfc8252#page-12
        const CLIENT_SECRET = '_rlHhLaiymDRVvjRwfumyN70';
        const host = '127.0.0.1';
        const port = '5555';

        const oauth2Client = new google.auth.OAuth2({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            redirectUri: `http://${host}:${port}`,
        });

        const authUrl = oauth2Client.generateAuthUrl({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            access_type: 'offline',
            scope: 'email',
        });

        return {
            authUrl,
            getToken: async (): Promise<{token: string; payload: any} | null> => {
                const code = await oAuthRedirectServer({
                    host,
                    port,
                });

                const {tokens} = await oauth2Client.getToken({code});

                if (!tokens.id_token) {
                    return null;
                }

                const data = await oauth2Client.verifyIdToken({
                    audience: CLIENT_ID,
                    idToken: tokens.id_token,
                });

                // TODO: store refresh token too
                const environmentConfigPath = path.join(
                    this.dirPaths.environmentsConfig,
                    this.id + JSON_FILE_EXTENSION,
                );
                const configStr = await fse.readFile(environmentConfigPath, 'utf-8');
                const config = configStr && JSON.parse(configStr);

                config.accessToken = tokens.id_token;
                await fse.writeFile(environmentConfigPath, JSON.stringify(config));

                return {
                    payload: await data.getPayload(),
                    token: tokens.id_token,
                };
            },
        };
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

        if (!this.config.relateURL) {
            throw new InvalidConfigError('Remote Environments must specify a `relateURL`');
        }

        // @todo this is not 100% reliable as the DBMS might be hosted on a
        // different domain.
        const relateUrl = new URL(this.config.relateURL);
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

    async statusDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data}: any = await this.graphql({
            query: gql`
                query StatusDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    statusDbmss(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        return data.statusDbmss;
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
}
