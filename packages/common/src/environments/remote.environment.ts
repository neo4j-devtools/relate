import {ApolloLink, execute, FetchResult, GraphQLRequest, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {IAuthToken} from '@huboneo/tapestry';
import fetch from 'node-fetch';
import gql from 'graphql-tag';
import path from 'path';
import _ from 'lodash';

import {GraphqlError, InvalidConfigError, NotAllowedError, NotFoundError} from '../errors';
import {EnvironmentConfigModel, IDbms, IDbmsInfo, IDbmsVersion} from '../models';
import {EnvironmentAbstract} from './environment.abstract';
import {envPaths} from '../utils';
import {AUTH_TOKEN_KEY, PUBLIC_ENVIRONMENT_METHODS} from '../constants';
import {ENVIRONMENTS_DIR_NAME} from './environment.constants';
import {ensureDirs} from '../system/files';
import {IExtensionMeta, IExtensionVersion} from '../utils/environment';

export class RemoteEnvironment extends EnvironmentAbstract {
    private client: ApolloLink;

    private relateUrl = `${this.httpOrigin}/graphql`;

    private readonly dirPaths = {
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
    }

    constructor(config: EnvironmentConfigModel, configPath: string) {
        super(config, configPath);

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

            return res;
        } catch (err) {
            if (err.statusCode === 401 || err.statusCode === 403) {
                throw new NotAllowedError('Unauthorized: must login to perform this operation');
            }

            throw err;
        }
    }

    async updateDbmsConfig(dbmsId: string, properties: Map<string, string>): Promise<boolean> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation UpdateDbmsConfig($dbmsId: String!, $properties: [[String!, String!]]!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.UPDATE_DBMS_CONFIG}(dbmsId: $dbmsId, properties: $properties)
                }
            `,
            variables: {
                dbmsId,
                properties: properties.entries(),
            },
        });

        if (errors) {
            throw new GraphqlError('Unable to update dbms config', _.map(errors, 'message'));
        }

        return data.updateDbmsConfig;
    }

    async listDbmsVersions(): Promise<IDbmsVersion[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                query ListDbmsVersions {
                    ${PUBLIC_ENVIRONMENT_METHODS.LIST_DBMS_VERSIONS} {
                        edition
                        version
                        origin
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError('Unable to list dbms versions', _.map(errors, 'message'));
        }

        return data.listDbmsVersions;
    }

    async installDbms(name: string, credentials: string, version: string): Promise<string> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation InstallDbms(
                    $environmentId: String!
                    $name: String!
                    $credentials: String!
                    $version: String!
                ) {
                    ${PUBLIC_ENVIRONMENT_METHODS.INSTALL_DBMS}(
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

        if (errors) {
            throw new GraphqlError('Unable to install dbms', _.map(errors, 'message'));
        }

        return data.installDbms;
    }

    async uninstallDbms(name: string): Promise<void> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation UninstallDbms($environmentId: String!, $name: String!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.UNINSTALL_DBMS}(environmentId: $environmentId, name: $name)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                name,
            },
        });

        if (errors) {
            throw new GraphqlError('Unable to uninstall dbms', _.map(errors, 'message'));
        }

        return data.uninstallDbms;
    }

    async getDbms(nameOrId: string): Promise<IDbms> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                query GetDbms($environmentId: String!, $nameOrId: String!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.GET_DBMS}(environmentId: $environmentId, dbmsId: $nameOrId) {
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

        if (errors) {
            throw new GraphqlError('Unable to get dbms', _.map(errors, 'message'));
        }

        const dbms = data.getDbms;

        if (!this.config.httpOrigin) {
            throw new InvalidConfigError('Remote Environments must specify an `httpOrigin`');
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
        const {data, errors}: any = await this.graphql({
            query: gql`
                query ListDbmss($environmentId: String!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.LIST_DBMSS}(environmentId: $environmentId) {
                        id
                        name
                        description
                        connectionUri
                    }
                }
            `,
            variables: {environmentId: this.config.relateEnvironment},
        });

        if (errors) {
            throw new GraphqlError('Unable to list dbmss', _.map(errors, 'message'));
        }

        return data.listDbmss;
    }

    async startDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation StartDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.START_DBMSS}(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        if (errors) {
            throw new GraphqlError('Unable to start dbmss', _.map(errors, 'message'));
        }

        return data.startDbmss;
    }

    async stopDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation StopDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.STOP_DBMSS}(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        if (errors) {
            throw new GraphqlError('Unable to stop dbmss', _.map(errors, 'message'));
        }

        return data.stopDbmss;
    }

    async infoDbmss(namesOrIds: string[]): Promise<IDbmsInfo[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                query InfoDBMSs($environmentId: String!, $namesOrIds: [String!]!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.INFO_DBMSS}(environmentId: $environmentId, dbmsIds: $namesOrIds) {
                        id
                        name
                        connectionUri
                        version
                        status
                        edition
                    }
                }
            `,
            variables: {
                environmentId: this.config.relateEnvironment,
                namesOrIds,
            },
        });

        if (errors) {
            throw new GraphqlError('Unable to info dbmss', _.map(errors, 'message'));
        }

        return data.infoDbmss;
    }

    async createAccessToken(appId: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation AccessDBMS(
                    $environmentId: String!
                    $dbmsNameOrId: String!
                    $authToken: AuthTokenInput!
                    $appId: String!
                ) {
                    ${PUBLIC_ENVIRONMENT_METHODS.CREATE_ACCESS_TOKEN}(
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

        if (errors) {
            throw new GraphqlError('Unable to create access token', _.map(errors, 'message'));
        }

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
                    ${PUBLIC_ENVIRONMENT_METHODS.INSTALLED_APPS} {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError('Unable to list installed apps', _.map(errors, 'message'));
        }

        return data.installedApps;
    }

    async listInstalledExtensions(): Promise<IExtensionMeta[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                query InstalledExtensions {
                    ${PUBLIC_ENVIRONMENT_METHODS.INSTALLED_EXTENSIONS} {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError('Unable to list installed extensions', _.map(errors, 'message'));
        }

        return data.installedExtensions;
    }

    linkExtension(_filePath: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support linking extensions`);
    }

    async installExtension(name: string, version: string): Promise<IExtensionMeta> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation InstallExtension($name: String!, version: String!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.INSTALL_EXTENSION}(name: $name, version: $version) {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {
                name,
                version,
            },
        });

        if (errors) {
            throw new GraphqlError('Unable to install extension', _.map(errors, 'message'));
        }

        return data.installExtension;
    }

    async listExtensionVersions(): Promise<IExtensionVersion[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                query ExtensionVersions {
                    ${PUBLIC_ENVIRONMENT_METHODS.LIST_EXTENSION_VERSIONS} {
                        name
                        version
                        origin
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError('Unable to list extension versions', _.map(errors, 'message'));
        }

        return data.listExtensionVersions;
    }

    async uninstallExtension(name: string): Promise<IExtensionMeta[]> {
        const {data, errors}: any = await this.graphql({
            query: gql`
                mutation UninstallExtension($name: String!) {
                    ${PUBLIC_ENVIRONMENT_METHODS.UNINSTALL_EXTENSION}(name: $name) {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {name},
        });

        if (errors) {
            throw new GraphqlError('Unable to uninstall extensions', _.map(errors, 'message'));
        }

        return data.uninstallExtension;
    }
}
