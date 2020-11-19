import {List} from '@relate/types';

import {IRelateFile, IProject, IProjectDbms, ProjectManifestModel, IProjectInput} from '../../models';
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

    create(_manifest: IProjectInput): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support creating projects`);
    }

    get(_nameOrId: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support getting projects`);
    }

    list(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing projects`);
    }

    link(_filePath: string): Promise<IProject> {
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
}
