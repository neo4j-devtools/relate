import {assign} from 'lodash';
import {IsBoolean, IsHash, IsOptional, IsString, IsUrl} from 'class-validator';
import {ModelAbstract} from './model.abstract';
import {IsPluginConfig} from './custom-validators';

export type DbmsPluginConfig = Record<string, string | string[] | boolean | undefined>;

export interface IDbmsPluginSource {
    /** Plugin name */
    name: string;

    /** Plugin homepage, users are directed here for information/support */
    homepageUrl: string;

    /** URL from which to fetch available plugin versions */
    versionsUrl: string;

    /** Whether the plugin source is officially supported */
    isOfficial?: boolean;
}

export interface IDbmsPluginVersion {
    /** Plugin semver */
    version: string;

    /** Supported DBMS semver (specific or range) */
    neo4jVersion: string;

    /** Plugin homepage URL */
    homepageUrl?: string;

    /** Plugin download URL */
    downloadUrl: string;

    /** sha256b checksum */
    sha256?: string;

    /** neo4j.conf changes needed */
    config: DbmsPluginConfig;
}

export interface IDbmsPluginInstalled extends IDbmsPluginSource {
    version: IDbmsPluginVersion;
}

export interface IDbmsPluginUpgradable {
    installed: IDbmsPluginInstalled;
    upgradable?: IDbmsPluginVersion;
}

export class DbmsPluginSourceModel extends ModelAbstract<IDbmsPluginSource> implements IDbmsPluginSource {
    @IsString()
    public name!: string;

    // eslint-disable-next-line @typescript-eslint/camelcase,camelcase
    @IsUrl({require_tld: false})
    public homepageUrl!: string;

    // eslint-disable-next-line @typescript-eslint/camelcase,camelcase
    @IsUrl({require_tld: false})
    public versionsUrl!: string;

    @IsOptional()
    @IsBoolean()
    public isOfficial?: boolean;
}

export class DbmsPluginVersionModel extends ModelAbstract<IDbmsPluginVersion> implements IDbmsPluginVersion {
    constructor(props: any) {
        super(props);

        // reassigning default values doesn't work when it's done from the parent class
        assign(this, props);
    }

    @IsString()
    public version!: string;

    @IsString()
    public neo4jVersion!: string;

    @IsOptional()
    @IsString()
    public homepageUrl?: string;

    // eslint-disable-next-line @typescript-eslint/camelcase,camelcase
    @IsUrl({require_tld: false})
    public downloadUrl!: string;

    @IsOptional()
    @IsHash('sha256')
    public sha256?: string;

    @IsOptional()
    @IsPluginConfig({each: true})
    public config: DbmsPluginConfig = {};
}
