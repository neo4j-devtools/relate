import _ from 'lodash';
import fse from 'fs-extra';
import decompress from 'decompress';
import path from 'path';

import {FileStructureError} from '../errors';
import {discoverExtension, IExtensionMeta} from './extension-versions';

export const extractExtension = async (archivePath: string, outputDir: string): Promise<IExtensionMeta> => {
    const outputFiles = await decompress(archivePath, outputDir);

    // determine output dir filename from the shortest directory string path
    const outputTopLevelDir = _.reduce(
        _.filter(outputFiles, (file) => file.type === 'directory'),
        (a, b) => (a.path.length <= b.path.length ? a : b),
    );

    if (!outputTopLevelDir) {
        await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
        throw new FileStructureError(`Unexpected file structure after unpacking`);
    }

    const extractedDistPath = path.join(outputDir, outputTopLevelDir.path);

    // check if this is an extension...
    try {
        const info = await discoverExtension(extractedDistPath);

        return info;
    } catch (e) {
        await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
        throw e;
    }
};
