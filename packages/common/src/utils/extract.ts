import decompress from 'decompress';
import fse from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import {FileStructureError} from '../errors';

export const extract = async (archivePath: string, outputDir: string): Promise<string> => {
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

    return path.join(outputDir, outputTopLevelDir.path);
};
