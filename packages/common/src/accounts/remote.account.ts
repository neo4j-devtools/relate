import {IAuthToken} from 'tapestry';
import {execute, makePromise, ApolloLink, FetchResult, GraphQLRequest} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';

import fetch from 'node-fetch';
import gql from 'graphql-tag';

import {FetchError, InvalidConfigError, NotAllowedError} from '../errors';
import {IDbms, IDbmsVersion, AccountConfigModel} from '../models/account-config.model';
import {AccountAbstract} from './account.abstract';

export class RemoteAccount extends AccountAbstract {
    private client: ApolloLink;

    constructor(protected config: AccountConfigModel) {
        super(config);

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
            throw new InvalidConfigError('Remote Accounts must specify a `relateURL`');
        }

        try {
            return makePromise(execute(this.client, operation));
        } catch {
            throw new FetchError(`Failed to connect to ${this.config.relateURL}`);
        }
    }

    updateDbmsConfig(_dbmsId: string, _properties: Map<string, string>): Promise<void> {
        throw new NotAllowedError(`${RemoteAccount.name} does not support updating DBMS configs`);
    }

    listDbmsVersions(): Promise<IDbmsVersion[]> {
        throw new NotAllowedError(`${RemoteAccount.name} does not support listing DBMS versions`);
    }

    installDbms(_name: string, _credentials: string, _version: string): Promise<string> {
        throw new NotAllowedError(`${RemoteAccount.name} does not support installing a DBMS`);
    }

    uninstallDbms(_name: string): Promise<void> {
        throw new NotAllowedError(`${RemoteAccount.name} does not support uninstalling a DBMS`);
    }

    async getDbms(nameOrId: string): Promise<IDbms> {
        const {data}: any = await this.graphql({
            query: gql`query GetDbms ($accountId: String!, nameOrId: String!) {
                getDbms(accountId: $accountId, nameOrId: $nameOrId) {
                    id,
                    name,
                    description,
                    connectionUri
                }
            }`,
            variables: {
                accountId: this.config.relateAccount,
                nameOrId,
            },
        });

        return data.getDbms;
    }

    async listDbmss(): Promise<IDbms[]> {
        const {data}: any = await this.graphql({
            query: gql`
                query ListDbmss($accountId: String!) {
                    listDbmss(accountId: $accountId) {
                        id
                        name
                        description
                        connectionUri
                    }
                }
            `,
            variables: {accountId: this.config.relateAccount},
        });

        return data.listDbmss;
    }

    async startDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation StartDBMSSs($accountId: String!, $namesOrIds: [String!]!) {
                    startDbmss(accountId: $accountId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                accountId: this.config.relateAccount,
                namesOrIds,
            },
        });

        return data.startDbmss;
    }

    async stopDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation StopDBMSSs($accountId: String!, $namesOrIds: [String!]!) {
                    stopDbmss(accountId: $accountId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                accountId: this.config.relateAccount,
                namesOrIds,
            },
        });

        return data.stopDbmss;
    }

    async statusDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data}: any = await this.graphql({
            query: gql`
                query StatusDBMSSs($accountId: String!, $namesOrIds: [String!]!) {
                    statusDbmss(accountId: $accountId, dbmsIds: $namesOrIds)
                }
            `,
            variables: {
                accountId: this.config.relateAccount,
                namesOrIds,
            },
        });

        return data.statusDbmss;
    }

    async createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string> {
        const {data}: any = await this.graphql({
            query: gql`
                mutation AccessDBMS(
                    $accountId: String!
                    $dbmsName: String!
                    $authToken: AuthTokenInput!
                    $appId: String!
                ) {
                    createAccessToken(accountId: $accountId, dbmsId: $dbmsName, appId: $appId, authToken: $authToken)
                }
            `,
            variables: {
                accountId: this.config.relateAccount,
                appId,
                dbmsId,
                authToken,
            },
        });

        return data.createAccessToken;
    }
}
