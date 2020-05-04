import {IAuthToken} from 'tapestry';
import got, {CancelableRequest} from 'got';

import {AccountAbstract} from './account.abstract';
import {NotAllowedError, InvalidConfigError, FetchError} from '../errors';
import {IDbms, IDbmsVersion} from '../models/account-config.model';

export class RemoteAccount extends AccountAbstract {
    private graphql<T>(query: string, variables: {[key: string]: any}): CancelableRequest<T> {
        if (!this.config.relateURL) {
            throw new InvalidConfigError('Remote Accounts must specify a `relateURL`');
        }

        try {
            return got<T>(this.config.relateURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            }).json();
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
        const {data} = await this.graphql(
            `query GetDbms ($accountId: String!, nameOrId: String!) {
                getDbms(accountId: $accountId, nameOrId: $nameOrId) {
                    id,
                    name,
                    description,
                    connectionUri
                }
            }`,
            {
                accountId: this.config.relateAccount,
                nameOrId,
            },
        );

        return data.getDbms;
    }

    async listDbmss(): Promise<IDbms[]> {
        const {data} = await this.graphql(
            `query ListDbmss ($accountId: String!) {
                listDbmss(accountId: $accountId) {
                    id,
                    name,
                    description,
                    connectionUri
                }
            }`,
            {accountId: this.config.relateAccount},
        );

        return data.listDbmss;
    }

    async startDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data} = await this.graphql(
            `mutation StartDBMSSs($accountId: String!, $namesOrIds: [String!]!) {
                startDbmss(accountId: $accountId, dbmsIds: $namesOrIds)
            }`,
            {
                accountId: this.config.relateAccount,
                namesOrIds,
            },
        );

        return data.startDbmss;
    }

    async stopDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data} = await this.graphql(
            `mutation StopDBMSSs($accountId: String!, $namesOrIds: [String!]!) {
                stopDbmss(accountId: $accountId, dbmsIds: $namesOrIds)
            }`,
            {
                accountId: this.config.relateAccount,
                namesOrIds,
            },
        );

        return data.stopDbmss;
    }

    async statusDbmss(namesOrIds: string[]): Promise<string[]> {
        const {data} = await this.graphql(
            `query StatusDBMSSs($accountId: String!, $namesOrIds: [String!]!) {
                statusDbmss(accountId: $accountId, dbmsIds: $namesOrIds)
            }`,
            {
                accountId: this.config.relateAccount,
                namesOrIds,
            },
        );

        return data.stopDbmss;
    }

    createAccessToken(_appId: string, _dbmsId: string, _authToken: IAuthToken): Promise<string> {
        throw new NotAllowedError(`${RemoteAccount.name} does not support creating access tokens`);
    }
}
