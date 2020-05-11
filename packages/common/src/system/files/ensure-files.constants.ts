import {EnvPaths} from '../../utils/env-paths';

export interface ILocalEnvironmentDirPaths extends EnvPaths {
    dbmss: string;
}

export interface ICacheDirPaths {
    dbmss: string;
    extensions: string;
}

export interface ISystemProviderDirPaths extends EnvPaths {
    environments: string;
}

export interface ISystemProviderFilePaths {
    knownConnections: string;
}
