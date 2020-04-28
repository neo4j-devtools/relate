import {EnvPaths} from '../../utils/env-paths';

export interface ILocalAccountDirPaths extends EnvPaths {
    neo4jDistribution: string;
}

export interface ISystemProviderDirPaths extends EnvPaths {
    accounts: string;
}

export interface ISystemProviderFilePaths {
    knownConnections: string;
}
