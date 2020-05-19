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

    // check if this is neo4j...
    try {
        const info = await getDistributionInfo(extractedDistPath);
        if (!info) {
            await Promise.all([
                ..._.map(outputFilePaths, filePath => fse.remove(path.join(outputDir, filePath))),
                fse.remove(archivePath)
            ]);
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

        await Promise.all([
            ..._.map(outputFilePaths, filePath => fse.remove(path.join(outputDir, filePath))),
            fse.remove(archivePath)
        ]);
        throw e;
    }
};
