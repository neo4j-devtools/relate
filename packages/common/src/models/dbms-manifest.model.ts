import {IsString, IsUUID} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {PropertiesFile} from '../system/files';
import {DBMS_STATUS, DBMS_SERVER_STATUS} from '../constants';
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
    serverStatus: DBMS_SERVER_STATUS;
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

export interface IDbmsManifest {
    id: string;
    name: string;
    description: string;
    tags: string[];
}

export interface IDbms extends IDbmsManifest {
    rootPath?: string;
    secure?: boolean;
    connectionUri: string;
    config: PropertiesFile;
}

export class DbmsManifestModel extends ModelAbstract<IDbmsManifest> implements IDbmsManifest {
    @IsUUID()
    public id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public description!: string;

    @IsString({each: true})
    public tags!: string[];
}
