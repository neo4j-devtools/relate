import {ApolloLink, execute, FetchResult, GraphQLRequest, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'node-fetch';
import path from 'path';
import {Dict} from '@relate/types';

import {RemoteDbmss} from '../dbmss';
import {RemoteExtensions} from '../extensions';
import {InvalidConfigError, NotAllowedError, NotSupportedError} from '../../errors';
import {EnvironmentAbstract} from './environment.abstract';
import {EnvironmentConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {AUTH_TOKEN_HEADER} from '../../constants';
import {ENVIRONMENTS_DIR_NAME} from './environment.constants';
import {ensureDirs} from '../../system/files';
import {RemoteProjects} from '../projects';
import {RemoteDbs} from '../dbs';
import {RemoteBackups} from '../backups';

export class RemoteEnvironment extends EnvironmentAbstract {
    public readonly dbmss = new RemoteDbmss(this);

    public readonly dbs = new RemoteDbs(this);

    public readonly extensions = new RemoteExtensions(this);

    public readonly projects = new RemoteProjects(this);

    public readonly backups = new RemoteBackups(this);

    private client: ApolloLink;

    private relateUrl = `${this.httpOrigin}/graphql`;

    public readonly dirPaths = {
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    constructor(config: EnvironmentConfigModel) {
        super(config);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.client = createHttpLink({
            // HttpLink wants a fetch implementation to make requests to a
            // GraphQL API. It wants the browser version of it which has a
            // few more options than the node version.
            credentials: 'include',
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            fetch: (url: string, opts: any) => {
                // @todo: this could definitely be done better
                const options = Dict.from(opts)
                    .merge({
                        credentials: 'include',
                        headers: {[AUTH_TOKEN_HEADER]: this.config.authToken},
                        mode: 'cors',
                    })
                    .toObject();

                return fetch(url, options);
            },
            uri: this.relateUrl,
        });
    }

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
    }

    public async graphql(operation: GraphQLRequest): Promise<FetchResult<{[key: string]: any}>> {
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

    generateAPIToken(_hostName: string, _clientId: string, _data: any = {}): Promise<string> {
        throw new NotSupportedError(`${RemoteEnvironment.name} does not support generating API tokens`);
    }

    verifyAPIToken(_hostName: string, _clientId: string, _token = ''): Promise<void> {
        throw new NotSupportedError(`${RemoteEnvironment.name} does not support validating API tokens`);
    }
}
