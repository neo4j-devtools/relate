import {IsEnum, IsString, IsOptional, IsUrl} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {AUTHENTICATOR_TYPES} from '../environments/environment.constants';
import {IGoogleAuthenticatorOptions} from '../environments/authenticators';

export type AuthenticatorOptions = Omit<IGoogleAuthenticatorOptions, 'httpOrigin'>;

export class AuthenticatorModel extends ModelAbstract<IGoogleAuthenticatorOptions>
    implements IGoogleAuthenticatorOptions {
    @IsUrl()
    public httpOrigin!: string;

    @IsEnum(AUTHENTICATOR_TYPES)
    public type!: AUTHENTICATOR_TYPES;

    @IsString()
    public clientId!: string;

    @IsString()
    public clientSecret!: string;

    @IsUrl()
    @IsOptional()
    public authenticationUrl?: string;

    @IsUrl()
    public redirectUrl!: string;

    @IsUrl()
    @IsOptional()
    public verificationUrl?: string;
}
