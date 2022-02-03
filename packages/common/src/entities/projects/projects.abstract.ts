import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {ManifestAbstract} from '../manifest';
import {
    IRelateFile,
    IProject,
    IProjectDbms,
    WriteFileFlag,
    ProjectManifestModel,
    IProjectInput,
    IDbmsInfo,
    ISampleProjectDbms,
    ISampleProjectInput,
    ISampleProjectRest,
} from '../../models';
import {IRelateFilter} from '../../utils/generic';

export abstract class ProjectsAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    public projects: {[id: string]: IProject} = {};

    abstract readonly manifest: ManifestAbstract<Env, IProject, ProjectManifestModel>;

    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * Creates new project
     * @param   manifest        Project data
     */
    abstract create(manifest: Omit<IProjectInput, 'id'>): Promise<IProject>;

    /**
     * Gets a project by name
     * @param   nameOrId
     */
    abstract get(nameOrId: string): Promise<IProject>;

    /**
     * List all available projects
     * @param   filters     Filters to apply
     */
    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>>;

    /**
     * Links an existing project
     * @param   externalPath    Path to project root
     * @param   name
     */
    abstract link(externalPath: string, name: string): Promise<IProject>;

    /**
     * Unlinks a linked project
     * @param   nameOrId
     */
    abstract unlink(nameOrId: string): Promise<IProject>;

    /**
     * List files for given project
     * @param   nameOrId
     * @param   filters         Filters to apply
     */
    abstract listFiles(nameOrId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateFile>>;

    /**
     * Adds file (copy) to project
     * @param   nameOrId
     * @param   source
     * @param   destination
     */
    abstract addFile(nameOrId: string, source: string, destination?: string, overwrite?: boolean): Promise<IRelateFile>;

    /**
     * Adds file (write) to project
     * @param   nameOrId
     * @param   destination
     * @param   data
     * @param   writeFlag
     */
    abstract writeFile(
        nameOrId: string,
        destination: string,
        data: string | Buffer,
        writeFlag?: WriteFileFlag,
    ): Promise<IRelateFile>;

    /**
     * Removes file from given project
     * @param   nameOrId
     * @param   relativePath    Path relative to project
     */
    abstract removeFile(nameOrId: string, relativePath: string): Promise<IRelateFile>;

    /**
     * Lists DBMSs for given project
     * @param   nameOrId
     * @param   filters         Filters to apply
     */
    abstract listDbmss(nameOrId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProjectDbms>>;

    /**
     * Adds DBMS to given project
     * @param   nameOrId        Project name or ID
     * @param   dbmsName        Name to give DBMS in project
     * @param   dbmsId
     * @param   principal       DBMS principal
     * @param   accessToken     DBMS access token
     */
    abstract addDbms(
        nameOrId: string,
        dbmsName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms>;

    /**
     * removes DBMS from given project
     * @param   nameOrId        Project name or ID
     * @param   dbmsName
     */
    abstract removeDbms(nameOrId: string, dbmsName: string): Promise<IProjectDbms>;

    /**
     * Lists sample projects from github (https://github.com/neo4j-graph-examples)
     */
    abstract listSampleProjects(): Promise<List<ISampleProjectRest>>;

    /**
     * Download sample project from github (https://github.com/neo4j-graph-examples)
     */
    abstract downloadSampleProject(
        url: string,
        name: string,
        destPath?: string,
    ): Promise<{path: string; temp: boolean}>;

    /**
     * Install sample project from file
     */
    abstract prepareSampleProject(
        srcPath: string,
        args: {
            name?: string;
            projectId?: string;
            temp?: boolean;
        },
    ): Promise<{project: IProjectInput; install?: ISampleProjectInput}>;

    /**
     * Install sample DBMSs from file
     */
    abstract importSampleDbms(
        projectId: string,
        dbms: ISampleProjectDbms,
        credentials: string,
    ): Promise<{created: IDbmsInfo; dump?: string; script?: string}>;
}
