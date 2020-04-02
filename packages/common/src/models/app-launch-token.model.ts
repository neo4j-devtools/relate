import {IsJWT, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';

export interface IAppLaunchToken {
    accountId: string;
    dbmsId: string;
    principal: string;
    appId: string;
    accessToken: string;
}

export class AppLaunchTokenModel extends ModelAbstract<IAppLaunchToken> implements IAppLaunchToken {
    @IsString()
    accountId!: string;

    @IsString()
    dbmsId!: string;

    @IsString()
    principal!: string;

    @IsString()
    appId!: string;

    // @todo: IMPORTANT: this validator seems to be broken.
    @IsJWT()
    accessToken!: string;
}
