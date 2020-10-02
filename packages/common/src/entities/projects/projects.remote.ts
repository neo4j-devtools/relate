import {List} from '@relate/types';

import {IRelateFile, IProject, IProjectManifest, IProjectDbms} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {RemoteEnvironment} from '../environments';
import {NotSupportedError} from '../../errors';
import {IRelateFilter} from '../../utils/generic';

export class RemoteProjects extends ProjectsAbstract<RemoteEnvironment> {
    create(_manifest: IProjectManifest): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support creating projects`);
    }

    get(_name: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support getting projects`);
    }

    list(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing projects`);
    }

    link(_filePath: string): Promise<IProject> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support linking projects`);
    }

    listFiles(_nameOrId: string, _filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateFile>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing project files`);
    }

    addFile(_name: string, _source: string, _destination?: string, _overwrite?: boolean): Promise<IRelateFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support adding project files`);
    }

    writeFile(_projectName: string, _destination: string, _data: string | Buffer): Promise<IRelateFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support writing to project files`);
    }

    removeFile(_name: string, _relativePath: string): Promise<IRelateFile> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support removing project files`);
    }

    listDbmss(_nameOrId: string, _filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProjectDbms>> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support listing project dbmss`);
    }

    addDbms(
        _name: string,
        _dbmsName: string,
        _dbmsId: string,
        _principal?: string,
        _accessToken?: string,
    ): Promise<IProjectDbms> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support adding project dbms`);
    }

    removeDbms(_name: string, _dbmsName: string): Promise<IProjectDbms> {
        throw new NotSupportedError(`${RemoteProjects.name} does not support removing project dbms`);
    }
}
