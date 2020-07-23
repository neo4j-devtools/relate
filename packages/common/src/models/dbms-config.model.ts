import {IsString, IsOptional} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {PropertiesFile} from '../system/files';
import {DBMS_STATUS} from '../constants';
import {NEO4J_EDITION, NEO4J_ORIGIN} from '../entities/environments';

export interface IDb {
    name: string;
    role: string;
    requestedStatus: string;
    currentStatus: string;
    error: string;
    default: boolean;
}

export interface IDbmsInfo extends Omit<IDbms, 'config'> {
    status: DBMS_STATUS;
    config?: null | undefined;
    edition?: NEO4J_EDITION;
    version?: string;
}

export interface IDbmsVersion {
    edition: NEO4J_EDITION;
    version: string;
    dist: string;
    origin: NEO4J_ORIGIN;
}

export interface IDbmsConfig {
    id: string;
    name: string;
    description: string;
    rootPath?: string;
    secure?: boolean;
}

export interface IDbms extends IDbmsConfig {
    connectionUri: string;
    config: PropertiesFile;
}

export class DbmsConfigModel extends ModelAbstract<IDbmsConfig> implements IDbmsConfig {
    // @todo: should be uuid
    @IsString()
    public id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public description!: string;

    @IsString()
    @IsOptional()
    public rootPath?: string;
}
