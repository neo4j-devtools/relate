import {IsEnum, IsString} from 'class-validator';

import {ModelAbstract} from './model.abstract';
import {EXTENSION_TYPES} from '../constants';

export interface IInstalledExtension {
    name: string;
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
    main!: string;

    @IsString()
    root!: string;
}
