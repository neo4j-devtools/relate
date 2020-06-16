import {List} from '@relate/types';

import {IFile, IProject, IProjectManifest, IProjectDbms, IDbms} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {RemoteEnvironment} from '../environments';
import {NotSupportedError} from '../../errors';

export class RemoteProjects extends ProjectsAbstract<RemoteEnvironment> {
    create(_manifest: IProjectManifest): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support creating projects`);
    }

    get(_name: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support getting projects`);
    }

    list(): Promise<List<IProject>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing projects`);
    }

    link(_filePath: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support linking projects`);
    }

    listFiles(_name: string): Promise<List<IFile>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing project files`);
    }

    addFile(_name: string, _source: string, _destination?: string): Promise<IFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support adding project files`);
    }

    removeFile(_name: string, _relativePath: string): Promise<IFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support removing project files`);
    }

    listDbmss(_name: string): Promise<List<IProjectDbms>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing project dbmss`);
    }

    addDbms(
        _name: string,
        _dbmsName: string,
        _dbms: IDbms,
        _principal?: string,
        _accessToken?: string,
    ): Promise<IProjectDbms> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support adding project dbms`);
    }

    removeDbms(_name: string, _dbmsName: string): Promise<IProjectDbms> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support removing project dbms`);
    }
}