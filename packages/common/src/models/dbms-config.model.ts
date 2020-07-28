import {IsString, IsOptional, IsUUID} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {PropertiesFile} from '../system/files';
import {DBMS_STATUS, ENTITY_TYPES} from '../constants';
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

export interface IRelateBackup {
    filePath: string;
    name: string;
    entityType: ENTITY_TYPES;
    entityId: string;
    created: Date;
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
    tags: string[];
    rootPath?: string;
    secure?: boolean;
}

export interface IDbms extends IDbmsConfig {
    connectionUri: string;
    config: PropertiesFile;
}

export class DbmsConfigModel extends ModelAbstract<IDbmsConfig> implements IDbmsConfig {
    // @todo: should be uuid
    @IsUUID()
    public id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public description!: string;

    @IsString({each: true})
    public tags!: string[];

    @IsString()
    @IsOptional()
    public rootPath?: string;
}
