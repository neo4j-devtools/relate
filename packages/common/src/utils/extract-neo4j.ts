import {FileStructureError} from '../errors';
import {getDistributionInfo} from '../environments/local.environment/utils/dbms-versions';
import {IDbmsVersion} from '../models';
import {extract} from './extract';
import {emitHookEvent} from './event-hooks';
import {HOOK_EVENTS} from '../constants';

interface IExtractedArchive extends IDbmsVersion {
    extractedDistPath: string;
}

export const extractNeo4j = async (archivePath: string, outputDir: string): Promise<IExtractedArchive> => {
    await emitHookEvent(HOOK_EVENTS.NEO4J_EXTRACT_START, 'extracting neo4j');
    const extractedDistPath = await extract(archivePath, outputDir);
    await emitHookEvent(HOOK_EVENTS.NEO4J_EXTRACT_STOP, null);

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
