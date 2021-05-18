import {Equals, IsObject, IsOptional, IsString} from 'class-validator';
import {AuthToken} from 'neo4j-driver-lite';

import {ModelAbstract} from './model.abstract';

export interface IAuthToken extends Omit<AuthToken, 'scheme'> {
    scheme: 'basic';
}

// @todo: Parameters type not exported from neo4j-driver-lite yet
export class AuthTokenModel extends ModelAbstract<IAuthToken> implements IAuthToken {
    @IsString()
    @Equals('basic')
    scheme!: 'basic';

    @IsString()
    principal!: string;

    @IsString()
    credentials!: string;

    @IsOptional()
    @IsString()
    realm?: string;

    @IsOptional()
    @IsObject()
    parameters?: {[key: string]: any};
}
