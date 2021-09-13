import {IsEnum, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {AUTHENTICATOR_TYPES, IGoogleAuthenticationOptions} from '../entities/environments/authentication';

export class GoogleAuthenticationModel extends ModelAbstract<IGoogleAuthenticationOptions>
    implements IGoogleAuthenticationOptions {
    @IsEnum(AUTHENTICATOR_TYPES)
    public type!: AUTHENTICATOR_TYPES;

    @IsString()
    public clientId!: string;

    @IsString()
    public clientSecret!: string;
}
