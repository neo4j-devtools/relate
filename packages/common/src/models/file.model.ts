import {ModelAbstract} from './model.abstract';
import {IsString} from 'class-validator';

export interface IRelateFile {
    name: string;
    directory: string;
    extension: string;
    downloadToken: string;
}

export class FileModel extends ModelAbstract<IRelateFile> implements IRelateFile {
    // @todo: should be uuid
    @IsString()
    public name!: string;

    @IsString()
    public directory!: string;

    @IsString()
    public extension!: string;

    @IsString()
    public downloadToken!: string;
}
