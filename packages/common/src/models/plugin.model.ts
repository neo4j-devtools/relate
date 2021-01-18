import {assign} from 'lodash';
import {IsHash, IsOptional, IsSemVer, IsString, IsUrl} from 'class-validator';

import {ModelAbstract, StringOrStringArray} from './model.abstract';

export interface IPluginSource {
    /** Plugin name */
    name: string;

    /** Plugin homepage, users are directed here for information/support */
    homepageUrl: string;

    /** URL from which to fetch available plugin versions */
    versionsUrl: string;
}

export interface IPluginVersion {
    /** Plugin semver */
    version: string;

    /** Supported DBMS semver (specific or range) */
    neo4jVersion: string;

    /** Plugin homepage URL */
    homepage: string;

    /** Plugin download URL */
    url: string;

    /** sha256b checksum */
    sha256: string;

    /** neo4j.conf changes needed */
    config: Record<string, string | string[]>;
}

export class PluginSourceModel extends ModelAbstract<IPluginSource> implements IPluginSource {
    @IsString()
    public name!: string;

    @IsUrl()
    public homepageUrl!: string;

    @IsUrl()
    public versionsUrl!: string;
}

export class PluginVersionModel extends ModelAbstract<IPluginVersion> implements IPluginVersion {
    constructor(props: any) {
        super(props);

        // reassigning default values doesn't work when it's done from the parent class
        assign(this, props);
    }

    @IsSemVer()
    public version!: string;

    @IsSemVer()
    public neo4jVersion!: string;

    @IsString()
    public homepage!: string;

    @IsUrl()
    public url!: string;

    @IsHash('sha256')
    public sha256!: string;

    @IsOptional()
    @StringOrStringArray({each: true})
    public config: Record<string, string | string[]> = {};
}
