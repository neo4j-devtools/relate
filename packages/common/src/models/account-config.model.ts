import {IsEnum, IsNotEmpty, IsString} from 'class-validator';

import {ACCOUNT_TYPES} from '../accounts';
import {ConfigModelAbstract} from './config-model.abstract';

export class AccountConfigModel extends ConfigModelAbstract {
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
}
