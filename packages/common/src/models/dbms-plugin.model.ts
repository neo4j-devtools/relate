import {assign} from 'lodash';
import {
    IsBoolean,
    IsHash,
    IsOptional,
    IsSemVer,
    IsString,
    IsUrl,
    isArray,
    isString,
    isBoolean,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import {ModelAbstract} from './model.abstract';

export type DbmsPluginConfig = Record<string, string | string[] | boolean | undefined>;

export function IsPluginConfig(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'stringOrStringArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown, _args: ValidationArguments) {
                    if (isArray(value)) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        return Array.from(value).every((v) => isString(v) || isBoolean(v));
                    }

                    return isString(value) || isBoolean(value);
                },
                defaultMessage(args?: ValidationArguments) {
                    if (!args) {
                        return 'Property must be "string | string[] | boolean"';
                    }

                    return `Expected "string | string[] | boolean" on "${args.property}" found "${args.value}"`;
                },
            },
        });
    };
}

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
    homepageUrl: string;

    /** Plugin download URL */
    downloadUrl: string;

    /** sha256b checksum */
    sha256?: string;

    /** neo4j.conf changes needed */
    config: DbmsPluginConfig;
}

export class DbmsPluginSourceModel extends ModelAbstract<IDbmsPluginSource> implements IDbmsPluginSource {
    @IsString()
    public name!: string;

    @IsUrl()
    public homepageUrl!: string;

    @IsUrl()
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

    @IsSemVer()
    public version!: string;

    @IsSemVer()
    public neo4jVersion!: string;

    @IsString()
    public homepageUrl!: string;

    @IsUrl()
    public downloadUrl!: string;

    @IsOptional()
    @IsHash('sha256')
    public sha256?: string;

    @IsOptional()
    @IsPluginConfig({each: true})
    public config: DbmsPluginConfig = {};
}
