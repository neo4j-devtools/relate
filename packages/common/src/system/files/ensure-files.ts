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
    const ensureDirPromises = _.map(paths, (path) => fse.ensureDir(path));

    return Promise.all(ensureDirPromises);
};

export const ensureFiles = (paths: ISystemProviderFilePaths): Promise<void[]> => {
    const ensureFilePromises = _.map(paths, (path) => fse.ensureFile(path));

    return Promise.all(ensureFilePromises);
};
