import _ from 'lodash';
import fse from 'fs-extra';
import decompress from 'decompress';
import path from 'path';

import {FileStructureError} from '../errors';
import {discoverExtension, IExtensionMeta} from './extension-versions';

export const extractExtension = async (archivePath: string, outputDir: string): Promise<IExtensionMeta> => {
    const outputFiles = await decompress(archivePath, outputDir);

    const outputDirectories = _.filter(outputFiles, (file) => file.type === 'directory')
    const outputFilePaths = outputDirectories.length ? _.map(outputDirectories, file => file.path) : _.map(outputFiles, file => _.split(file.path, path.sep)[0])

    const outputTopLevelDir = _.reduce(
        outputFilePaths,
        (a, b) => (a.length <= b.length ? a : b),
    );

    if (!outputTopLevelDir) {
        await Promise.all([
            ..._.map(outputFilePaths, filePath => fse.remove(path.join(outputDir, filePath))),
            fse.remove(archivePath)
        ]);
        throw new FileStructureError(`Unexpected file structure after unpacking`);
    }

    const extractedDistPath = path.join(outputDir, outputTopLevelDir);

    // check if this is an extension...
    try {
        const info = await discoverExtension(extractedDistPath);

        return info;
    } catch (e) {
        await Promise.all([
            ..._.map(outputFilePaths, filePath => fse.remove(path.join(outputDir, filePath))),
            fse.remove(archivePath)
        ]);
        throw e;
    }
};
