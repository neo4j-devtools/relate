import gql from 'graphql-tag';
import {List} from '@relate/types';
import {IAuthToken} from '@huboneo/tapestry';

import {IDbms, IDbmsInfo, IDbmsVersion} from '../models';

import {DbmssAbstract} from './dbmss.abstract';
import {RemoteEnvironment} from '../environments';
import {PUBLIC_GRAPHQL_METHODS} from '../constants';
import {GraphqlError, InvalidConfigError, NotSupportedError} from '../errors';
import {PropertiesFile} from '../system/files';

export class RemoteDbmss extends DbmssAbstract<RemoteEnvironment> {
    async updateConfig(dbmsId: string, properties: Map<string, string>): Promise<boolean> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation UpdateDbmsConfig($dbmsId: String!, $properties: [[String!, String!]]!) {
                    ${PUBLIC_GRAPHQL_METHODS.UPDATE_DBMS_CONFIG}(dbmsId: $dbmsId, properties: $properties)
                }
            `,
            variables: {
                dbmsId,
                properties: properties.entries(),
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to update dbms config',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data.updateDbmsConfig;
    }

    async versions(): Promise<List<IDbmsVersion>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query ListDbmsVersions {
                    ${PUBLIC_GRAPHQL_METHODS.LIST_DBMS_VERSIONS} {
                        edition
                        version
                        origin
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list dbms versions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data.listDbmsVersions;
    }

    async install(name: string, credentials: string, version: string): Promise<string> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation InstallDbms(
                    $environmentId: String!
                    $name: String!
                    $credentials: String!
                    $version: String!
                ) {
                    ${PUBLIC_GRAPHQL_METHODS.INSTALL_DBMS}(
                        environmentId: $environmentId
                        name: $name
                        credentials: $credentials
                        version: $version
                    )
                }
            `,
            variables: {
                credentials,
                environmentId: this.environment.relateEnvironment,
                name,
                version,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to install dbms',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data.installDbms;
    }

    async uninstall(name: string): Promise<void> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation UninstallDbms($environmentId: String!, $name: String!) {
                    ${PUBLIC_GRAPHQL_METHODS.UNINSTALL_DBMS}(environmentId: $environmentId, name: $name)
                }
            `,
            variables: {
                environmentId: this.environment.relateEnvironment,
                name,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to uninstall dbms',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data.uninstallDbms;
    }

    async get(nameOrId: string): Promise<IDbms> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query GetDbms($environmentId: String!, $nameOrId: String!) {
                    ${PUBLIC_GRAPHQL_METHODS.GET_DBMS}(environmentId: $environmentId, dbmsId: $nameOrId) {
                        id
                        name
                        description
                        connectionUri
                    }
                }
            `,
            variables: {
                environmentId: this.environment.relateEnvironment,
                nameOrId,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to get dbms',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        const dbms = data.getDbms;

        if (!this.environment.httpOrigin) {
            throw new InvalidConfigError('Remote Environments must specify an `httpOrigin`');
        }

        // @todo this is not 100% reliable as the DBMS might be hosted on a
        // different domain.
        const relateUrl = new URL(this.environment.httpOrigin);
        const connectionUri = new URL(dbms.connectionUri);
        connectionUri.hostname = relateUrl.hostname;
        dbms.connectionUri = connectionUri.toString();

        return dbms;
    }

    async list(): Promise<List<IDbms>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query ListDbmss($environmentId: String!) {
                    ${PUBLIC_GRAPHQL_METHODS.LIST_DBMSS}(environmentId: $environmentId) {
                        id
                        name
                        description
                        connectionUri
                    }
                }
            `,
            variables: {environmentId: this.environment.relateEnvironment},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list dbmss',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data.listDbmss);
    }

    async start(namesOrIds: string[]): Promise<List<string>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation StartDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    ${PUBLIC_GRAPHQL_METHODS.START_DBMSS}(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.environment.relateEnvironment,
                namesOrIds,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to start dbmss',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data.startDbmss);
    }

    async stop(namesOrIds: string[]): Promise<List<string>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation StopDBMSSs($environmentId: String!, $namesOrIds: [String!]!) {
                    ${PUBLIC_GRAPHQL_METHODS.STOP_DBMSS}(environmentId: $environmentId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                environmentId: this.environment.relateEnvironment,
                namesOrIds,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to stop dbmss',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data.stopDbmss);
    }

    async info(namesOrIds: string[]): Promise<List<IDbmsInfo>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query InfoDBMSs($environmentId: String!, $namesOrIds: [String!]!) {
                    ${PUBLIC_GRAPHQL_METHODS.INFO_DBMSS}(environmentId: $environmentId, dbmsIds: $namesOrIds) {
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
                environmentId: this.environment.relateEnvironment,
                namesOrIds,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to info dbmss',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data.infoDbmss);
    }

    async createAccessToken(appName: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation AccessDBMS(
                    $environmentId: String!
                    $dbmsNameOrId: String!
                    $authToken: AuthTokenInput!
                    $appName: String!
                ) {
                    ${PUBLIC_GRAPHQL_METHODS.CREATE_ACCESS_TOKEN}(
                        environmentId: $environmentId
                        dbmsId: $dbmsNameOrId
                        appName: $appName
                        authToken: $authToken
                    )
                }
            `,
            variables: {
                appName,
                authToken,
                dbmsNameOrId,
                environmentId: this.environment.relateEnvironment,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to create access token',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data.createAccessToken;
    }

    getDbmsConfig(_dbmsId: string): Promise<PropertiesFile> {
        throw new NotSupportedError(`${RemoteDbmss.name} does not support getting DBMS config`);
    }
}
