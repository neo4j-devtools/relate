import {HOOK_EVENTS} from '../../constants';
import {FileStructureError} from '../../errors';
import {IDbmsVersion} from '../../models';
import {emitHookEvent} from '../event-hooks';
import {extract} from '../extract';
import {getDistributionInfo} from './dbms-versions';

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
