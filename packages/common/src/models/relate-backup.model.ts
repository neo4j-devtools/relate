import {ModelAbstract} from './model.abstract';
import {IsDate, IsEnum, IsObject, IsString, IsUUID} from 'class-validator';
import {ENTITY_TYPES} from '../constants';

export interface IRelateBackup {
    id: string;
    directory: string;
    name: string;
    entityType: ENTITY_TYPES;
    entityId: string;
    entityMeta: any;
    created: Date;
}

export class RelateBackupModel extends ModelAbstract<IRelateBackup> implements IRelateBackup {
    @IsUUID()
    public id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public directory!: string;

    @IsEnum(ENTITY_TYPES)
    public entityType!: ENTITY_TYPES;

    @IsUUID()
    public entityId!: string;

    @IsObject()
    public entityMeta!: any;

    @IsDate()
    public created!: Date;
}
