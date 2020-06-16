import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {IFile, IProjectManifest, IProject, IProjectDbms, IDbms} from '../../models';

export abstract class ProjectsAbstract<Env extends EnvironmentAbstract> {
    public projects: {[id: string]: IProject} = {};

    constructor(protected readonly environment: Env) {}

    abstract create(manifest: IProjectManifest, path?: string): Promise<IProject>;

    abstract get(name: string): Promise<IProject>;

    abstract list(): Promise<List<IProject>>;

    abstract link(filePath: string): Promise<IProject>;

    abstract listFiles(projectId: string): Promise<List<IFile>>;

    abstract addFile(name: string, source: string, destination?: string): Promise<IFile>;

    abstract removeFile(name: string, relativePath: string): Promise<IFile>;

    abstract listDbmss(projectId: string): Promise<List<IProjectDbms>>;

    abstract addDbms(
        projectName: string,
        dbmsName: string,
        dbms: IDbms,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms>;

    abstract removeDbms(projectName: string, dbmsName: string): Promise<IProjectDbms>;
}
