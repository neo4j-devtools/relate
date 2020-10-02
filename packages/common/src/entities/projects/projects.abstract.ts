import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {IRelateFile, IProject, IProjectDbms, WriteFileFlag, IProjectInput} from '../../models';
import {IRelateFilter} from '../../utils/generic';

export abstract class ProjectsAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    public projects: {[id: string]: IProject} = {};

    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * Creates new project
     * @param   manifest        Project data
     * @param   path            Path to project root
     */
    abstract create(manifest: IProjectInput, path?: string): Promise<IProject>;

    /**
     * Gets a project by name
     * @param   nameOrID
     */
    abstract get(nameOrID: string): Promise<IProject>;

    /**
     * List all available projects
     * @param   filters     Filters to apply
     */
    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>>;

    /**
     * Links an existing project
     * @param   filePath    Path to project root
     */
    abstract link(filePath: string): Promise<IProject>;

    /**
     * List files for given project
     * @param   projectId
     * @param   filters         Filters to apply
     */
    abstract listFiles(projectId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateFile>>;

    /**
     * Adds file (copy) to project
     * @param   projectId
     * @param   source
     * @param   destination
     */
    abstract addFile(
        projectId: string,
        source: string,
        destination?: string,
        overwrite?: boolean,
    ): Promise<IRelateFile>;

    /**
     * Adds file (write) to project
     * @param   projectId
     * @param   destination
     * @param   data
     * @param   writeFlag
     */
    abstract writeFile(
        projectId: string,
        destination: string,
        data: string | Buffer,
        writeFlag?: WriteFileFlag,
    ): Promise<IRelateFile>;

    /**
     * Removes file from given project
     * @param   projectId
     * @param   relativePath    Path relative to project
     */
    abstract removeFile(projectId: string, relativePath: string): Promise<IRelateFile>;

    /**
     * Lists DBMSs for given project
     * @param   projectId
     * @param   filters         Filters to apply
     */
    abstract listDbmss(projectId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProjectDbms>>;

    /**
     * Adds DBMS to given project
     * @param   projectId
     * @param   dbmsName        Name to give DBMS in project
     * @param   dbmsId
     * @param   principal       DBMS principal
     * @param   accessToken     DBMS access token
     */
    abstract addDbms(
        projectId: string,
        dbmsName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms>;

    /**
     * removes DBMS from given project
     * @param   projectId
     * @param   dbmsName
     */
    abstract removeDbms(projectId: string, dbmsName: string): Promise<IProjectDbms>;
}
