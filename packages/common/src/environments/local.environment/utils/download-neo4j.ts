import _ from 'lodash';
import fse from 'fs-extra';
import got from 'got';
import hasha from 'hasha';

import {NEO4J_EDITION, NEO4J_SHA_ALGORITHM} from '../../environment.constants';
import {HOOK_EVENTS} from '../../../constants';
import {fetchNeo4jVersions} from './dbms-versions';
import {FetchError, IntegrityError, NotFoundError} from '../../../errors';
import {extractNeo4j, emitHookEvent, download} from '../../../utils';

export const getCheckSum = async (url: string): Promise<string> => {
    try {
        const response = await got(url);
        const {body: shaSum} = response;
        return shaSum;
    } catch (e) {
        throw new FetchError(e);
    }
};

export const verifyHash = async (
    expectedShasumHash: string,
    pathToFile: string,
    algorithm = NEO4J_SHA_ALGORITHM,
): Promise<string> => {
    const hash = await hasha.fromFile(pathToFile, {algorithm});
    if (hash !== expectedShasumHash) {
        // @todo maybe not?
        // remove tmp output
        await fse.remove(pathToFile);
        throw new IntegrityError('Expected hash mismatch');
    }
    return hash;
};

export const downloadNeo4j = async (version: string, neo4jDistributionPath: string): Promise<void> => {
    const onlineVersions = await fetchNeo4jVersions();
    const requestedDistribution = _.find(
        onlineVersions,
        (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === version,
    );

    if (!requestedDistribution) {
        throw new NotFoundError(`Unable to find the requested version: ${version} online`);
    }
    const requestedDistributionUrl = requestedDistribution.dist;
    const shaSum = await getCheckSum(`${requestedDistributionUrl}.${NEO4J_SHA_ALGORITHM}`);

    await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, null);
    const downloadFilePath = await download(requestedDistributionUrl, neo4jDistributionPath);
    await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, null);
    await verifyHash(shaSum, downloadFilePath);

    await extractNeo4j(downloadFilePath, neo4jDistributionPath);
    await fse.remove(downloadFilePath);
};
