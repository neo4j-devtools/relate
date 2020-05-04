import _ from 'lodash';
import fse from 'fs-extra';
import decompress from 'decompress';
import path from 'path';

import {FileStructureError} from '../../../errors';
import {getDistributionInfo} from '../utils';

export const extractFromArchive = async (archivePath: string, outputDir: string): Promise<string> => {
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
    const extractedDirPath = path.join(outputDir, outputTopLevelDir.path);

    // check if this is neo4j...
    try {
        const info = await getDistributionInfo(extractedDirPath);
        if (!info) {
            throw new FileStructureError(`Archive "${archivePath}" is not a Neo4j distribution`);
        }
        return extractedDirPath;
    } catch (e) {
        await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
        throw e;
    }
};
