import {EnvPaths} from '../../utils/env-paths';

export interface ILocalAccountDirPaths extends EnvPaths {
    neo4jDistributionPath: string;
}

export interface ISystemProviderDirPaths extends EnvPaths {
    accountsPath: string;
}

export interface ISystemProviderFilePaths {
    knownConnections: string;
}
