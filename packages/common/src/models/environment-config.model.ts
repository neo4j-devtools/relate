import {IsEnum, IsNotEmpty, IsString, IsOptional, IsBoolean} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {ENVIRONMENT_TYPES} from '../entities/environments/environment.constants';
import {IsValidUrl} from './custom-validators';
import {IAuthenticationOptions} from '../entities/environments/authentication';

export interface IEnvironmentAuth {
    authUrl: string;
    getToken: () => Promise<string>;
}

export interface IEnvironmentConfig {
    id: string;
    configPath?: string;
    active?: boolean;
    type: ENVIRONMENT_TYPES;
    user: any;
    neo4jDataPath?: string;
    httpOrigin?: string;
    relateEnvironment?: string;
    authToken?: string;
    authentication?: IAuthenticationOptions;
    allowedMethods?: string[];
}

export interface IEnvironmentConfigInput extends IEnvironmentConfig {
    configPath: string;
}

export class EnvironmentConfigModel extends ModelAbstract<IEnvironmentConfigInput> implements IEnvironmentConfigInput {
    // @todo: should be uuid
    @IsString()
    public id!: string;

    // @todo: should be uuid
    @IsString()
    public configPath!: string;

    @IsBoolean()
    @IsOptional()
    public active?: boolean;

    @IsEnum(ENVIRONMENT_TYPES)
    public type!: ENVIRONMENT_TYPES;

    // @todo: should be typed
    @IsNotEmpty()
    public user: any;

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
    public authentication?: IAuthenticationOptions;

    @IsOptional()
    @IsString({each: true})
    public allowedMethods?: string[];

    // @todo: move this to data
    @IsString()
    @IsOptional()
    public authToken?: string;
}
