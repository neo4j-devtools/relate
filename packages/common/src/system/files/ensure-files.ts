import _ from 'lodash';
import fse from 'fs-extra';

import {ILocalAccountDirPaths, ISystemProviderPaths} from './ensure-files.constants';

export const ensurePaths = (paths: ILocalAccountDirPaths | ISystemProviderPaths): Promise<void[]> => {
    /* eslint-disable consistent-return */
    const ensureDirPromises = _.map(paths, async (path, pathName) => {
        if (!(await fse.pathExists(path))) {
            return pathName.endsWith('FilePath') ? fse.ensureFile(path) : fse.ensureDir(path);
        }
    });

    return Promise.all(ensureDirPromises);
};
