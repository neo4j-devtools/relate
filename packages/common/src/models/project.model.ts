import {ModelAbstract} from './model.abstract';
import {IsArray, IsString} from 'class-validator';

export interface IProjectManifest {
    name: string;
    dbmss: IProjectDbms[];
}

export interface IProject {
    id: string;
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
    // @todo: should be uuid
    @IsString()
    public id!: string;

    @IsString()
    public name!: string;

    @IsString()
    public root!: string;

    @IsArray()
    public dbmss!: IProjectDbms[];
}
