import {ModelAbstract} from './model.abstract';
import {IsArray, IsString, IsUUID} from 'class-validator';

// https://nodejs.org/api/fs.html#fs_file_system_flags
export enum WriteFileFlag {
    OVERWRITE = 'w+',
    APPEND = 'a+',
}

export interface IProjectInput {
    name: string;
    dbmss: IProjectDbms[];
}

export interface IProjectManifest extends IProjectInput {
    id: string;
}

export interface IProject extends IProjectManifest {
    root: string;
}

export interface IProjectDbms {
    name: string;
    connectionUri: string;
    user?: string;
    accessToken?: string;
}

export class ProjectModel extends ModelAbstract<IProject> implements IProject {
    @IsUUID()
    public id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public root!: string;

    @IsArray()
    public dbmss!: IProjectDbms[];
}
