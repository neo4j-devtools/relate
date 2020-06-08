import {IsEnum, IsNotEmpty, IsString, IsOptional, IsBoolean} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {ENVIRONMENT_TYPES} from '../environments/environment.constants';
import {GoogleAuthenticatorOptions} from './authenticator.model';
import {IsValidUrl} from './custom-validators';

export interface IEnvironmentAuth {
    authUrl: string;
    getToken: () => Promise<{
        authToken: string;
        redirectTo?: string;
    }>;
}

export interface IEnvironmentConfig {
    id: string;
    active?: boolean;
    type: ENVIRONMENT_TYPES;
    user: any;
    neo4jDataPath?: string;
    httpOrigin?: string;
    relateEnvironment?: string;
    authToken?: string;
    authenticator?: GoogleAuthenticatorOptions;
    allowedMethods?: string[];
}

export class EnvironmentConfigModel extends ModelAbstract<IEnvironmentConfig> implements IEnvironmentConfig {
    // @todo: should be uuid
    @IsString()
    public id!: string;

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
    public authenticator?: GoogleAuthenticatorOptions;

    @IsOptional()
    @IsString({each: true})
    public allowedMethods?: string[];

    // @todo: move this to data
    @IsString()
    @IsOptional()
    public authToken?: string;
}
