import {ModelAbstract} from './model.abstract';
import {IsString} from 'class-validator';

export interface IFile {
    name: string;
    directory: string;
    extension: string;
}

export class FileModel extends ModelAbstract<IFile> implements IFile {
    // @todo: should be uuid
    @IsString()
    public name!: string;

    @IsString()
    public directory!: string;

    @IsString()
    public extension!: string;
}
