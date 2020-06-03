import {IsEnum, IsString, IsOptional} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {AUTHENTICATOR_TYPES, IGoogleAuthenticatorOptions} from '../environments/authenticators';
import {IsValidUrl} from './custom-validators';

export type GoogleAuthenticatorOptions = Omit<IGoogleAuthenticatorOptions, 'httpOrigin'>;

export class GoogleAuthenticatorModel extends ModelAbstract<IGoogleAuthenticatorOptions>
    implements IGoogleAuthenticatorOptions {
    @IsValidUrl()
    public httpOrigin!: string;

    @IsEnum(AUTHENTICATOR_TYPES)
    public type!: AUTHENTICATOR_TYPES;

    @IsString()
    public clientId!: string;

    @IsString()
    public clientSecret!: string;

    @IsValidUrl()
    @IsOptional()
    public authenticationUrl?: string;

    @IsValidUrl()
    public redirectUrl!: string;

    @IsValidUrl()
    @IsOptional()
    public verificationUrl?: string;
}
