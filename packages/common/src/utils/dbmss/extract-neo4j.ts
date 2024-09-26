import fse from 'fs-extra';
import path from 'path';

import {HOOK_EVENTS} from '../../constants';
import {FileStructureError} from '../../errors';
import {IDbmsVersion} from '../../models';
import {emitHookEvent} from '../event-hooks';
import {extract} from '../extract';
import {getDistributionInfo} from './dbms-versions';

interface IExtractedArchive extends IDbmsVersion {
    extractedDistPath: string;
}

const addPackageInfo = async (dir: string, installer?: string) => {
    if (installer === undefined) {
        return;
    }

    const packageInfoFile = path.join(dir, 'packaging_info');
    const packageInfo = await fse.readFile(packageInfoFile, 'utf8');
    const newPackageInfo = packageInfo.replace(/Package Type: (.*)/gm, `Package Type: ${installer}`);
    await fse.writeFile(packageInfoFile, newPackageInfo, 'utf8');
};

export const extractNeo4j = async (
    archivePath: string,
    outputDir: string,
    installer?: string,
): Promise<IExtractedArchive> => {
    await emitHookEvent(HOOK_EVENTS.NEO4J_EXTRACT_START, 'extracting neo4j');
    const extractedDistPath = await extract(archivePath, outputDir);
    await addPackageInfo(extractedDistPath, installer).catch(() => {
        // Do nothing
    });
    await emitHookEvent(HOOK_EVENTS.NEO4J_EXTRACT_STOP, null);

    // check if this is neo4j...
    const info = await getDistributionInfo(extractedDistPath);
    if (!info) {
        throw new FileStructureError(`Archive "${archivePath}" is not a recognized Neo4j distribution`);
    }
    return {
        ...info,
        extractedDistPath,
    };
};
