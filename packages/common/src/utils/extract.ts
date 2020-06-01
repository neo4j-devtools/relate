import decompress from 'decompress';
import fse from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import {FileStructureError} from '../errors';

export const extract = async (archivePath: string, outputDir: string): Promise<string> => {
    const outputFiles = await decompress(archivePath, outputDir);
    // get unique top level file paths
    const outputFilePaths = [...new Set(_.map(outputFiles, file => _.split(path.normalize(file.path), path.sep)[0]))];

    if (outputFilePaths.length !== 1) {
        // delete the extracted output (not the archive)
        await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
        throw new FileStructureError(`Unexpected file structure after unpacking`);
    }

    return path.join(outputDir, outputFilePaths[0]);
};
