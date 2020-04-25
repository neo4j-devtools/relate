import {EnvPaths} from '../../utils/env-paths';

export interface ILocalAccountDirPaths extends EnvPaths {
    neo4jDistributionPath: string;
}

export interface ISystemProviderPaths extends EnvPaths {
    accountsPath: string;
    dbmssPath: string;
    knownConnectionsFilePath: string;
}
