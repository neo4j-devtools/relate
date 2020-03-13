import {IsEnum, IsNotEmpty, IsString, IsOptional} from 'class-validator';

import {ACCOUNT_TYPES} from '../accounts';
import {ModelAbstract} from './model.abstract';

export interface IDbms {
    id: string;
    name: string;
    description: string;
}

export interface IAccountConfig {
    id: string;
    user: any;
    neo4jDataPath: string;
    type: ACCOUNT_TYPES;
    dbmss?: {[key: string]: IDbms};
}

export class AccountConfigModel extends ModelAbstract<IAccountConfig> implements IAccountConfig {
    // @todo: should be uuid
    @IsString()
    public id!: string;

    // @todo: should be typed
    @IsNotEmpty()
    public user: any;

    @IsEnum(ACCOUNT_TYPES)
    public type!: ACCOUNT_TYPES;

    @IsString()
    public neo4jDataPath!: string;

    @IsOptional()
    public dbmss?: {[key: string]: IDbms};
}
