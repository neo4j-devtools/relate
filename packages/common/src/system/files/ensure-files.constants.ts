import {EnvPaths} from '../../utils/env-paths';

export interface ILocalEnvironmentDirPaths extends EnvPaths {
    dbmssCache: string;
    environmentsConfig: string;
}

export interface ICacheDirPaths {
    dbmss: string;
    extensions: string;
}

export interface ISystemProviderDirPaths extends EnvPaths {
    environmentsConfig: string;
}

export interface ISystemProviderFilePaths {
    knownConnections: string;
}
