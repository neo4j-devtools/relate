import {IsBoolean, IsEnum, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {EXTENSION_ORIGIN, EXTENSION_TYPES, EXTENSION_VERIFICATION_STATUS} from '../constants';

export interface IInstalledExtension {
    name: string;
    version: string;
    type: EXTENSION_TYPES;
    main: string;
    root: string;
}

export class ExtensionModel extends ModelAbstract<IInstalledExtension> implements IInstalledExtension {
    @IsString()
    name!: string;

    @IsEnum(EXTENSION_TYPES)
    type!: EXTENSION_TYPES;

    @IsString()
    version!: string;

    @IsString()
    main!: string;

    @IsString()
    root!: string;
}

export class InstalledExtensionModel extends ModelAbstract<IInstalledExtension> implements IInstalledExtension {
    @IsString()
    name!: string;

    @IsEnum(EXTENSION_TYPES)
    type!: EXTENSION_TYPES;

    @IsString()
    version!: string;

    @IsString()
    main!: string;

    @IsString()
    root!: string;
}

export interface IExtensionInfo extends IInstalledExtension {
    official: boolean;
    verification: EXTENSION_VERIFICATION_STATUS;
    dist: string;
    origin: EXTENSION_ORIGIN;
}

export class ExtensionInfoModel extends ModelAbstract<IExtensionInfo> implements IExtensionInfo {
    @IsString()
    name!: string;

    @IsEnum(EXTENSION_TYPES)
    type!: EXTENSION_TYPES;

    @IsString()
    version!: string;

    @IsString()
    main!: string;

    @IsString()
    root!: string;

    @IsString()
    dist!: string;

    @IsEnum(EXTENSION_VERIFICATION_STATUS)
    verification!: EXTENSION_VERIFICATION_STATUS;

    @IsEnum(EXTENSION_ORIGIN)
    origin!: EXTENSION_ORIGIN;

    @IsBoolean()
    official!: boolean;
}
