import {IsEnum, IsNotEmpty, IsString, IsOptional} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {ENVIRONMENT_TYPES, NEO4J_EDITION, NEO4J_ORIGIN} from '../environments/environment.constants';
import {PropertiesFile} from '../system/files';
import {AuthenticatorOptions} from './authenticator.model';
import {IsValidUrl} from './custom-validators';

export interface IEnvironmentAuth {
    authUrl: string;
    getToken: () => Promise<{
        authToken: string;
        redirectTo?: string;
    }>;
}

export interface IDbms {
    id: string;
    name: string;
    description: string;
    rootPath?: string;
    connectionUri: string;
    config: PropertiesFile;
}

export interface IDbmsInfo extends Omit<IDbms, 'config'> {
    status: string;
    config?: null | undefined;
    edition?: NEO4J_EDITION;
    version?: string;
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
    httpOrigin?: string;
    relateEnvironment?: string;
    authToken?: string;
    dbmss?: {[key: string]: IDbms};
    authenticator?: AuthenticatorOptions;
    allowedMethods?: string[];
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

    @IsValidUrl()
    @IsOptional()
    public httpOrigin?: string;

    // @todo: this is RemoteEnvironment specific
    @IsString()
    @IsOptional()
    public relateEnvironment?: string;

    @IsOptional()
    public authenticator?: AuthenticatorOptions;

    @IsOptional()
    @IsString({each: true})
    public allowedMethods?: string[];

    // @todo: move this to data
    @IsString()
    @IsOptional()
    public authToken?: string;

    // @todo: move this to data
    @IsOptional()
    public dbmss?: {[key: string]: IDbms};
}
