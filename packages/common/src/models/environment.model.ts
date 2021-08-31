import {IsEnum, IsString, IsOptional, IsBoolean, IsUUID, Validate} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {ENVIRONMENT_TYPES} from '../entities/environments/environment.constants';
import {IsValidUrl} from './custom-validators';
import {IAuthenticationOptions} from '../entities/environments/authentication';
import {PUBLIC_GRAPHQL_METHODS} from '../constants';

export interface IEnvironmentAuth {
    authUrl: string;
    getToken: () => Promise<string>;
}

export interface IServerConfig {
    publicGraphQLMethods: PUBLIC_GRAPHQL_METHODS[];
    requiresAPIToken?: boolean;
}

export interface IEnvironmentConfigInput {
    name: string;
    active?: boolean;
    type: ENVIRONMENT_TYPES;
    user?: any;
    relateDataPath?: string;
    httpOrigin?: string;
    remoteEnvironmentId?: string;
    authToken?: string;
    authentication?: IAuthenticationOptions;
    serverConfig?: IServerConfig;
}

export interface IEnvironmentConfig extends IEnvironmentConfigInput {
    id: string;
    configPath: string;
}

export class ServerConfigModel extends ModelAbstract<IServerConfig> implements IServerConfig {
    @IsEnum(PUBLIC_GRAPHQL_METHODS, {each: true})
    public publicGraphQLMethods!: PUBLIC_GRAPHQL_METHODS[];

    @IsBoolean()
    @IsOptional()
    public requiresAPIToken?: boolean;
}

export class EnvironmentConfigModel extends ModelAbstract<IEnvironmentConfig> implements IEnvironmentConfig {
    @IsUUID('4')
    public id!: string;

    @IsString()
    public name!: string;

    // @todo: should be uuid
    @IsString()
    public configPath!: string;

    @IsBoolean()
    @IsOptional()
    public active?: boolean;

    @IsEnum(ENVIRONMENT_TYPES)
    public type!: ENVIRONMENT_TYPES;

    // @todo: should be typed
    @IsOptional()
    public user?: any;

    // @todo: this is LocalEnvironment specific
    @IsString()
    @IsOptional()
    public relateDataPath?: string;

    @IsValidUrl()
    @IsOptional()
    public httpOrigin?: string;

    @IsUUID('4')
    @IsOptional()
    public remoteEnvironmentId?: string;

    @IsOptional()
    public authentication?: IAuthenticationOptions;

    @IsOptional()
    @Validate(ServerConfigModel)
    public serverConfig?: ServerConfigModel;

    // @todo: move this to data
    @IsString()
    @IsOptional()
    public authToken?: string;
}
