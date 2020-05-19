import decompress from 'decompress';
import fse from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import {FileStructureError} from '../errors';

export const extract = async (archivePath: string, outputDir: string): Promise<string> => {
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

    return path.join(outputDir, outputTopLevelDir);
};
