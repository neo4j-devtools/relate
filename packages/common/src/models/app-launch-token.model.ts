import {IsString, Matches} from 'class-validator';

import {ModelAbstract} from './model.abstract';

export interface IAppLaunchToken {
    environmentId: string;
    dbmsId: string;
    principal: string;
    appId: string;
    accessToken: string;
}

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

export class AppLaunchTokenModel extends ModelAbstract<IAppLaunchToken> implements IAppLaunchToken {
    @IsString()
    environmentId!: string;

    @IsString()
    dbmsId!: string;

    @IsString()
    principal!: string;

    @IsString()
    appId!: string;

    // @todo: @IsJWT() validator seems to be broken.
    @IsString()
    @Matches(JWT_REGEX)
    accessToken!: string;
}
