import _ from 'lodash';
import fse from 'fs-extra';

import {
    ICacheDirPaths,
    ILocalEnvironmentDirPaths,
    ISystemProviderDirPaths,
    ISystemProviderFilePaths,
    IRemoteEnvironmentDirPaths,
} from './ensure-files.constants';

export const ensureDirs = (
    paths: IRemoteEnvironmentDirPaths | ILocalEnvironmentDirPaths | ICacheDirPaths | ISystemProviderDirPaths,
): Promise<void[]> => {
    /* eslint-disable consistent-return */
    const ensureDirPromises = _.map(paths, async (path) => {
        if (!(await fse.pathExists(path))) {
            return fse.ensureDir(path);
        }
    });

    return Promise.all(ensureDirPromises);
};

export const ensureFiles = (paths: ISystemProviderFilePaths): Promise<void[]> => {
    /* eslint-disable consistent-return */
    const ensureFilePromises = _.map(paths, async (path) => {
        if (!(await fse.pathExists(path))) {
            return fse.ensureFile(path);
        }
    });

    return Promise.all(ensureFilePromises);
};
