import {EnvPaths} from '../../utils/env-paths';

export interface ILocalEnvironmentDirPaths extends EnvPaths {
    neo4jDistribution: string;
}

export interface ISystemProviderDirPaths extends EnvPaths {
    environments: string;
}

export interface ISystemProviderFilePaths {
    knownConnections: string;
}
