import {IsArray, IsOptional} from 'class-validator';
import {assign} from 'lodash';
import {ManifestModel, IManifest, IManifestInput} from './manifest.model';

export interface ISampleProjectDbms {
    name?: string;
    description?: string;
    dumpFile?: string;
    scriptFile?: string;
    targetNeo4jVersion: string;
    plugins: string[];
}

export interface ISampleProjectInput extends IManifestInput {
    name: string;
    description: string;
    dbms: ISampleProjectDbms[];
}
export interface ISampleProjectManifest extends IManifest {
    name: string;
    description: string;
    dbms: ISampleProjectDbms[];
}

export interface ISampleProject extends IManifest {
    name: string;
    description: string;
}

export interface ISampleProjectRest {
    name: string;
    description: string;
    downloadUrl: string;
    /* eslint-disable-next-line camelcase */
    default_branch: string;
}

export class ProjectInstallManifestModel extends ManifestModel<ISampleProject> implements ISampleProjectManifest {
    constructor(props: any) {
        super(props);

        // reassigning default values doesn't work when it's done from the parent class
        assign(this, props);
    }

    @IsOptional()
    @IsArray()
    public dbms: ISampleProjectDbms[] = [];
}
