import {IsOptional, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {IsValidJWT} from './custom-validators';

export interface IAppLaunchToken {
    environmentId: string;
    dbmsId: string;
    principal?: string;
    appId: string;
    accessToken?: string;
}

export class AppLaunchTokenModel extends ModelAbstract<IAppLaunchToken> implements IAppLaunchToken {
    @IsString()
    environmentId!: string;

    @IsString()
    dbmsId!: string;

    @IsString()
    @IsOptional()
    principal?: string;

    @IsString()
    appId!: string;

    // @todo: @IsJWT() validator seems to be broken.
    @IsOptional()
    @IsValidJWT()
    accessToken?: string;
}
