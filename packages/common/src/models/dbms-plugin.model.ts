import {assign, isObjectLike} from 'lodash';
import {
    IsBoolean,
    IsHash,
    IsOptional,
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
            name: 'isPluginConfig',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    if (isObjectLike(value)) {
                        return Object.entries(value).every(([_, v]) => {
                            if (isArray(v)) {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                // @ts-ignore
                                return Array.from(v).every(isString);
                            }

                            return isString(v) || isBoolean(v);
                        });
                    }

                    return false;
                },
                defaultMessage(args?: ValidationArguments) {
                    const expectedMsg = 'Expected "{ [key: string]: string | string[] | boolean }"';

                    if (!args) {
                        return expectedMsg;
                    }

                    const strValue = JSON.stringify(args.value);
                    return `${expectedMsg} on "${args.property}" but found "${strValue}" instead`;
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

    @IsString()
    public version!: string;

    @IsString()
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
