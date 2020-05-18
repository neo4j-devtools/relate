import _ from 'lodash';
import fse from 'fs-extra';
import decompress from 'decompress';
import path from 'path';

import {FileStructureError, DependencyError} from '../errors';
import {getDistributionInfo} from '../environments/local.environment/utils/dbms-versions';
import {IDbmsVersion} from '../models';

interface IExtractedArchive extends IDbmsVersion {
    extractedDistPath: string;
}

export const extractNeo4j = async (archivePath: string, outputDir: string): Promise<IExtractedArchive> => {
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

    // check if this is neo4j...
    try {
        const info = await getDistributionInfo(extractedDistPath);
        if (!info) {
            throw new FileStructureError(`Archive "${archivePath}" is not a Neo4j distribution`);
        }
        return {
            ...info,
            extractedDistPath,
        };
    } catch (e) {
        if (e.name === DependencyError.name) {
            throw e;
        }

        await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
        throw e;
    }
};
