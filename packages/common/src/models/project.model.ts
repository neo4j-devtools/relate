import {IsArray, IsOptional} from 'class-validator';
import {assign} from 'lodash';
import {ManifestModel, IManifest, IManifestInput} from './manifest.model';

// https://nodejs.org/api/fs.html#fs_file_system_flags
export enum WriteFileFlag {
    OVERWRITE = 'w+',
    APPEND = 'a+',
}

export interface IProjectDbms {
    name: string;
    connectionUri: string;
    user?: string;
    accessToken?: string;
}

export interface IProjectInput extends IManifestInput {
    dbmss?: IProjectDbms[];
}

export interface IProjectManifest extends IManifest {
    dbmss: IProjectDbms[];
}

export interface IProject extends IProjectManifest {
    root: string;
}

export class ProjectManifestModel extends ManifestModel<IProject> implements IProjectManifest {
    constructor(props: any) {
        super(props);

        // reassigning default values doesn't work when it's done from the parent class
        assign(this, props);
    }

    @IsOptional()
    @IsArray()
    public dbmss: IProjectDbms[] = [];
}
