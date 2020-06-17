import {IsEnum, IsString, IsOptional, IsBoolean, IsUUID} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {ENVIRONMENT_TYPES} from '../entities/environments/environment.constants';
import {IsValidUrl} from './custom-validators';
import {IAuthenticationOptions} from '../entities/environments/authentication';

export interface IEnvironmentAuth {
    authUrl: string;
    getToken: () => Promise<string>;
}

export interface IEnvironmentConfig extends IEnvironmentConfigInput {
    id: string;
    configPath: string;
}

export interface IEnvironmentConfigInput {
    name: string;
    active?: boolean;
    type: ENVIRONMENT_TYPES;
    user?: any;
    neo4jDataPath?: string;
    httpOrigin?: string;
    remoteEnvironmentId?: string;
    authToken?: string;
    authentication?: IAuthenticationOptions;
    allowedMethods?: string[];
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
    public neo4jDataPath?: string;

    @IsValidUrl()
    @IsOptional()
    public httpOrigin?: string;

    // @todo: this is RemoteEnvironment specific
    @IsString()
    @IsOptional()
    public remoteEnvironmentId?: string;

    @IsOptional()
    public authentication?: IAuthenticationOptions;

    @IsOptional()
    @IsString({each: true})
    public allowedMethods?: string[];

    // @todo: move this to data
    @IsString()
    @IsOptional()
    public authToken?: string;
}
