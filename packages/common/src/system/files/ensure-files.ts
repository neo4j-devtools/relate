import _ from 'lodash';
import fse from 'fs-extra';

import {EnvPaths} from '../../utils/env-paths';

export interface ILocalAccountDirPaths extends EnvPaths {
    neo4jDistributionPath: string;
}

export interface ISystemProviderPaths extends EnvPaths {
    accountsPath: string;
    dbmssPath: string;
    knownConnectionsFilePath: string;
}

export const ensurePaths = (paths: ILocalAccountDirPaths | ISystemProviderPaths): Promise<void[]> => {
    /* eslint-disable consistent-return */
    const ensureDirPromises = _.map(paths, async (path, pathName) => {
        if (!(await fse.pathExists(path))) {
            return pathName.endsWith('FilePath') ? fse.ensureFile(path) : fse.ensureDir(path);
        }
    });

    return Promise.all(ensureDirPromises);
};
