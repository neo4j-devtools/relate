import {IAuthToken} from 'tapestry';
import {execute, makePromise, ApolloLink, FetchResult, GraphQLRequest} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';

import fetch from 'node-fetch';
import gql from 'graphql-tag';

import {FetchError, InvalidConfigError, NotAllowedError} from '../errors';
import {IDbms, IDbmsVersion, EnvironmentConfigModel} from '../models/environment-config.model';
import {EnvironmentAbstract} from './environment.abstract';

export class RemoteEnvironment extends EnvironmentAbstract {
    private client: ApolloLink;

    constructor(config: EnvironmentConfigModel, configPath: string) {
        super(config, configPath);

        this.client = new HttpLink({
            uri: this.config.relateURL,
            // HttpLink wants a fetch implementation to make requests to a
            // GraphQL API. It wants the browser version of it which has a
            // few more options than the node version.
            fetch: fetch as any,
        });
    }

    private graphql(operation: GraphQLRequest): Promise<FetchResult<{[key: string]: any}>> {
        if (!this.config.relateURL) {
            throw new InvalidConfigError('Remote Environments must specify a `relateURL`');
        }

        try {
            return makePromise(execute(this.client, operation));
        } catch {
            throw new FetchError(`Failed to connect to ${this.config.relateURL}`);
        }
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
                environmentId: this.config.relateEnvironment,
                name,
                credentials,
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

    getDbms(_nameOrId: string): Promise<IDbms> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support getting a DBMS`);
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

    async createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation AccessDBMS(
                    $environmentId: String!
                    $dbmsName: String!
                    $authToken: AuthTokenInput!
                    $appId: String!
                ) {
                    createAccessToken(
                        environmentId: $environmentId
                        dbmsId: $dbmsName
                        appId: $appId
                        authToken: $authToken
                    )
                }
            `,
            variables: {
                appId,
                authToken,
                dbmsId,
                environmentId: this.config.relateEnvironment,
            },
        });

        return data.createAccessToken;
    }

    getAppUrl(_appName: string): Promise<string> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support getting app URLs`);
    }
}
