import {IsEnum, IsNotEmpty, IsString, IsOptional} from 'class-validator';

import {ENVIRONMENT_TYPES} from '../environments';
import {ModelAbstract} from './model.abstract';
import {NEO4J_EDITION, NEO4J_ORIGIN} from '../environments/environment.constants';
import {PropertiesFile} from '../system/files';

export interface IEnvironmentAuth {
    authUrl: string;
    getToken: () => Promise<{
        token: string;
        payload: any | undefined;
    } | null>;
}

export interface IDbms {
    id: string;
    name: string;
    description: string;
    rootPath?: string;
    connectionUri: string;
    config: PropertiesFile;
}

export interface IDbmsVersion {
    edition: NEO4J_EDITION;
    version: string;
    dist: string;
    origin: NEO4J_ORIGIN;
}

export interface IEnvironmentConfig {
    id: string;
    user: any;
    neo4jDataPath?: string;
    type: ENVIRONMENT_TYPES;
    relateURL?: string;
    relateEnvironment?: string;
    accessToken?: string;
    dbmss?: {[key: string]: IDbms};
}

export class EnvironmentConfigModel extends ModelAbstract<IEnvironmentConfig> implements IEnvironmentConfig {
    // @todo: should be uuid
    @IsString()
    public id!: string;

    // @todo: should be typed
    @IsNotEmpty()
    public user: any;

    @IsEnum(ENVIRONMENT_TYPES)
    public type!: ENVIRONMENT_TYPES;

    // @todo: this is LocalEnvironment specific
    @IsString()
    @IsOptional()
    public neo4jDataPath?: string;

    // @todo: this is RemoteEnvironment specific
    @IsString()
    @IsOptional()
    public relateURL?: string;

    // @todo: this is RemoteEnvironment specific
    @IsString()
    @IsOptional()
    public relateEnvironment?: string;

    // @todo: move this to data
    @IsString()
    @IsOptional()
    public accessToken?: string;

    // @todo: move this to data
    @IsOptional()
    public dbmss?: {[key: string]: IDbms};
}
