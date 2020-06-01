import {FileStructureError} from '../errors';
import {getDistributionInfo} from '../environments/local.environment/utils/dbms-versions';
import {IDbmsVersion} from '../models';
import {extract} from './extract';

interface IExtractedArchive extends IDbmsVersion {
    extractedDistPath: string;
}

export const extractNeo4j = async (archivePath: string, outputDir: string): Promise<IExtractedArchive> => {
    const extractedDistPath = await extract(archivePath, outputDir);

    // check if this is neo4j...
    const info = await getDistributionInfo(extractedDistPath);
    if (!info) {
        throw new FileStructureError(`Archive "${archivePath}" is not a Neo4j distribution`);
    }
    return {
        ...info,
        extractedDistPath,
    };
};
