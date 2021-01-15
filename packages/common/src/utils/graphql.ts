import {ApolloLink, execute, FetchResult, GraphQLRequest, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import fetch from 'node-fetch';

import {Dict} from '@relate/types';

import {NotAllowedError} from '../errors';

export abstract class GraphQLAbstract {
    /**
     * @hidden
     */
    constructor(protected readonly config: IGraphQLConfig) {}

    /**
     * Executes an operation
     * @operation   operation
     */
    abstract execute(operation: GraphQLRequest): Promise<FetchResult<{[key: string]: any}>>;
}

export interface IGraphQLConfig {
    uri: string;
    headers: {[key: string]: any};
}

export class GraphQLClient extends GraphQLAbstract {
    private client: ApolloLink;

    constructor(protected readonly config: IGraphQLConfig) {
        super(config);
        const {uri, headers} = config;

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
                        headers,
                        mode: 'cors',
                    })
                    .toObject();

                return fetch(url, options);
            },
            uri,
        });
    }

    public async execute(operation: GraphQLRequest): Promise<FetchResult<{[key: string]: any}>> {
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
}
