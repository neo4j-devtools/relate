import {List} from '@relate/types';
import {Got} from 'got';

import {
    IRelateFile,
    IProject,
    IProjectDbms,
    ProjectManifestModel,
    IProjectInput,
    ISampleProjectRest,
    IDbmsInfo,
    ISampleProjectDbms,
    ISampleProjectInput,
} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {RemoteEnvironment} from '../environments';
import {NotSupportedError} from '../../errors';
import {IRelateFilter} from '../../utils/generic';
import {ManifestRemote} from '../manifest';
import {ENTITY_TYPES} from '../../constants';

export class RemoteProjects extends ProjectsAbstract<RemoteEnvironment> {
    public readonly manifest = new ManifestRemote(
        this.environment,
        ENTITY_TYPES.PROJECT,
        ProjectManifestModel,
        (nameOrId: string) => this.get(nameOrId),
    );

    create(_manifest: Omit<IProjectInput, 'id'>): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support creating projects`);
    }

    get(_nameOrId: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support getting projects`);
    }

    list(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing projects`);
    }

    link(_externalPath: string, _name: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support linking projects`);
    }

    unlink(_nameOrId: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support unlinking projects`);
    }

    listFiles(_nameOrId: string, _filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateFile>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing project files`);
    }

    addFile(_nameOrId: string, _source: string, _destination?: string, _overwrite?: boolean): Promise<IRelateFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support adding project files`);
    }

    writeFile(_projectName: string, _destination: string, _data: string | Buffer): Promise<IRelateFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support writing to project files`);
    }

    removeFile(_nameOrId: string, _relativePath: string): Promise<IRelateFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support removing project files`);
    }

    listDbmss(_nameOrId: string, _filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProjectDbms>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing project dbmss`);
    }

    addDbms(
        _nameOrId: string,
        _dbmsName: string,
        _dbmsId: string,
        _principal?: string,
        _accessToken?: string,
    ): Promise<IProjectDbms> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support adding project dbms`);
    }

    removeDbms(_nameOrId: string, _dbmsName: string): Promise<IProjectDbms> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support removing project dbms`);
    }

    listSampleProjects(_fetch?: () => any | Got): Promise<List<ISampleProjectRest>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing sample projects`);
    }

    downloadSampleProject(_url: string, _name: string, _destPath?: string): Promise<{path: string; temp: boolean}> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support downloading sample projects`);
    }

    prepareSampleProject(
        _srcPath: string,
        _args: {
            name?: string;
            projectId?: string;
            temp?: boolean;
        },
    ): Promise<{project: IProjectInput; install?: ISampleProjectInput}> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support installing sample projects`);
    }

    importSampleDbms(
        _projectId: string,
        _dbms: ISampleProjectDbms,
        _credentials: string,
    ): Promise<{created: IDbmsInfo; dump?: string; script?: string}> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support installing sample dbmss`);
    }
}
