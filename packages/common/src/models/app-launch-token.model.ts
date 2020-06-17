import {IsOptional, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {IsValidJWT} from './custom-validators';

export interface IAppLaunchToken {
    environmentNameOrId: string;
    dbmsId: string;
    principal?: string;
    appName: string;
    accessToken?: string;
}

export class AppLaunchTokenModel extends ModelAbstract<IAppLaunchToken> implements IAppLaunchToken {
    @IsString()
    environmentNameOrId!: string;

    @IsString()
    dbmsId!: string;

    @IsString()
    @IsOptional()
    principal?: string;

    @IsString()
    appName!: string;

    // @todo: @IsJWT() validator seems to be broken.
    @IsOptional()
    @IsValidJWT()
    accessToken?: string;
}
