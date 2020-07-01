import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {IRelateFile, IProjectManifest, IProject, IProjectDbms, IDbms, WriteFileFlag} from '../../models';
import {IRelateFilter} from '../../utils/generic';

export abstract class ProjectsAbstract<Env extends EnvironmentAbstract> {
    public projects: {[id: string]: IProject} = {};

    constructor(protected readonly environment: Env) {}

    abstract create(manifest: IProjectManifest, path?: string): Promise<IProject>;

    abstract get(name: string): Promise<IProject>;

    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>>;

    abstract link(filePath: string): Promise<IProject>;

    abstract listFiles(
        projectName: string,
        filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IRelateFile>>;

    abstract addFile(projectName: string, source: string, destination?: string): Promise<IRelateFile>;

    abstract writeFile(
        projectName: string,
        destination: string,
        data: string | Buffer,
        writeFlag?: WriteFileFlag,
    ): Promise<IRelateFile>;

    abstract removeFile(projectName: string, relativePath: string): Promise<IRelateFile>;

    abstract listDbmss(
        projectName: string,
        filters?: List<IRelateFilter> | IRelateFilter[],
    ): Promise<List<IProjectDbms>>;

    abstract addDbms(
        projectName: string,
        dbmsName: string,
        dbms: IDbms,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms>;

    abstract removeDbms(projectName: string, dbmsName: string): Promise<IProjectDbms>;
}
