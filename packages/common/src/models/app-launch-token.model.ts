import {IsOptional, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {IsValidJWT} from './custom-validators';

export interface IAppLaunchToken {
    environmentId: string;
    dbmsId: string;
    principal?: string;
    appName: string;
    accessToken?: string;
    projectId?: string;
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
    appName!: string;

    // @todo: @IsJWT() validator seems to be broken.
    @IsOptional()
    @IsValidJWT()
    accessToken?: string;

    @IsString()
    @IsOptional()
    projectId?: string;
}
