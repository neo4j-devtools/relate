import {ModelAbstract} from './model.abstract';
import {IsArray, IsString} from 'class-validator';

// https://nodejs.org/api/fs.html#fs_file_system_flags
export enum WriteFileFlag {
    OVERWRITE = 'w+',
    APPEND = 'a+',
}

export interface IProjectManifest {
    name: string;
    dbmss: IProjectDbms[];
}

export interface IProject {
    name: string;
    dbmss: IProjectDbms[];
    root: string;
}

export interface IProjectDbms {
    name: string;
    connectionUri: string;
    user?: string;
    accessToken?: string;
}

export class ProjectModel extends ModelAbstract<IProject> implements IProject {
    @IsString()
    public name!: string;

    @IsString()
    public root!: string;

    @IsArray()
    public dbmss!: IProjectDbms[];
}
