import {FetchResult, GraphQLRequest} from 'apollo-link';
import path from 'path';

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
import {GraphQLClient, GraphQLAbstract} from '../../utils/graphql';
import {RemoteDbmsPlugins} from '../dbms-plugins';

export class RemoteEnvironment extends EnvironmentAbstract {
    public readonly dbmss = new RemoteDbmss(this);

    public readonly dbmsPlugins = new RemoteDbmsPlugins(this);

    public readonly dbs = new RemoteDbs(this);

    public readonly extensions = new RemoteExtensions(this);

    public readonly projects = new RemoteProjects(this);

    public readonly backups = new RemoteBackups(this);

    private graphqlClient: GraphQLAbstract;

    private relateUrl = `${this.httpOrigin}/graphql`;

    public readonly dirPaths = {
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    constructor(config: EnvironmentConfigModel) {
        super(config);

        this.graphqlClient = new GraphQLClient({
            headers: {[AUTH_TOKEN_HEADER]: this.config.authToken},
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

        const res = await this.graphqlClient.execute(operation);
        return res;
    }

    generateAPIToken(_hostName: string, _clientId: string, _data: any = {}): Promise<string> {
        throw new NotSupportedError(`${RemoteEnvironment.name} does not support generating API tokens`);
    }

    verifyAPIToken(_hostName: string, _clientId: string, _token = ''): Promise<void> {
        throw new NotSupportedError(`${RemoteEnvironment.name} does not support validating API tokens`);
    }
}
