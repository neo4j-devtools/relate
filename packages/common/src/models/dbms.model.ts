import {IsBoolean, IsOptional, IsString} from 'class-validator';
import {assign} from 'lodash';

import {PropertiesFile} from '../system/files';
import {DBMS_STATUS, DBMS_SERVER_STATUS} from '../constants';
import {NEO4J_EDITION, NEO4J_ORIGIN} from '../entities/environments';
import {ManifestModel, IManifest} from './manifest.model';
import {IsValidJWT} from './custom-validators';
import {ModelAbstract} from './model.abstract';

export interface IDb {
    name: string;
    role: string;
    requestedStatus: string;
    currentStatus: string;
    error: string;
    default: boolean;
}

export interface IQueryTarget {
    dbmsNameOrId: string;
    dbmsUser: string;
    accessToken: string;
    database?: string;
}

export interface IDbms extends IManifest {
    rootPath?: string;
    secure?: boolean;
    connectionUri: string;
    config: PropertiesFile;
    isCustomPathInstallation: boolean;
}

export interface IDbmsInfo extends Omit<IDbms, 'config'> {
    status: DBMS_STATUS;
    serverStatus: DBMS_SERVER_STATUS;
    config?: null | undefined;
    edition?: NEO4J_EDITION;
    version?: string;
    prerelease?: string;
}

export interface IDbmsVersion {
    edition: NEO4J_EDITION;
    version: string;
    prerelease?: string;
    dist: string;
    origin: NEO4J_ORIGIN;
}

export enum PLUGIN_UPGRADE_MODE {
    ALL = 'ALL',
    NONE = 'NONE',
    UPGRADABLE = 'UPGRADABLE',
}

export interface IDbmsUpgradeOptions {
    noCache?: boolean;
    migrate?: boolean;
    backup?: boolean;
    pluginUpgradeMode?: PLUGIN_UPGRADE_MODE;
}

export class DbmsManifestModel extends ManifestModel<IManifest> implements IManifest {
    constructor(props: any) {
        super(props);

        // reassigning default values doesn't work when it's done from the parent class
        assign(this, props);
    }

    @IsOptional()
    @IsBoolean()
    public isCustomPathInstallation = false;
}

export class QueryTargetModel extends ModelAbstract<IQueryTarget> {
    @IsString()
    public dbmsNameOrId!: string;

    @IsString()
    public dbmsUser!: string;

    @IsValidJWT()
    public accessToken!: string;

    @IsOptional()
    @IsString()
    public database?: string;
}
