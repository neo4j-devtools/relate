import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {IRelateFile, IProject, IProjectDbms, WriteFileFlag, IProjectInput} from '../../models';
import {IRelateFilter} from '../../utils/generic';

export abstract class ProjectsAbstract<Env extends EnvironmentAbstract> {
    public projects: {[id: string]: IProject} = {};

    constructor(protected readonly environment: Env) {}

    abstract create(manifest: IProjectInput, path?: string): Promise<IProject>;

    abstract get(nameOrID: string): Promise<IProject>;

    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>>;

    abstract link(filePath: string): Promise<IProject>;

    abstract listFiles(projectId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateFile>>;

    abstract addFile(projectId: string, source: string, destination?: string): Promise<IRelateFile>;

    abstract writeFile(
        projectId: string,
        destination: string,
        data: string | Buffer,
        writeFlag?: WriteFileFlag,
    ): Promise<IRelateFile>;

    abstract removeFile(projectId: string, relativePath: string): Promise<IRelateFile>;

    abstract listDbmss(projectId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProjectDbms>>;

    abstract addDbms(
        projectId: string,
        dbmsName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms>;

    abstract removeDbms(projectId: string, dbmsName: string): Promise<IProjectDbms>;
}
