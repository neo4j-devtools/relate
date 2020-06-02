import _ from 'lodash';
import fse from 'fs-extra';
import got from 'got';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import stream from 'stream';
import {promisify} from 'util';
import hasha from 'hasha';

import {NEO4J_EDITION, NEO4J_SHA_ALGORITHM} from '../../environment.constants';
import {DOWNLOADING_FILE_EXTENSION, HOOK_EVENTS} from '../../../constants';
import {fetchNeo4jVersions} from './dbms-versions';
import {FetchError, IntegrityError, NotFoundError} from '../../../errors';
import {extractNeo4j, emitHookEvent} from '../../../utils';

export const getCheckSum = async (url: string): Promise<string> => {
    try {
        const response = await got(url);
        const {body: shaSum} = response;
        return shaSum;
    } catch (e) {
        throw new FetchError(e);
    }
};

// @todo: this still needs a test in future as I couldn't figure out the tests just yet.
// https://dev.to/cdanielsen/testing-streams-a-primer-3n6e has some interesting points to start with.
export const pipeline = async (url: string, outputPath: string): Promise<void> => {
    const streamPipeline = promisify(stream.pipeline);

    try {
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, null);
        await streamPipeline(
            got
                .stream(url)
                .on('downloadProgress', async (progress) =>
                    emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_PROGRESS, progress),
                ),
            fse.createWriteStream(outputPath),
        );
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, null);
    } catch (e) {
        // remove tmp output
        await fse.remove(outputPath);
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

    // Download straight to the distribution path with a temporary name that
    // makes it obvious that the file is not finished downloading.
    const downloadingName = `${uuidv4()}${DOWNLOADING_FILE_EXTENSION}`;
    const downloadingPath = path.join(neo4jDistributionPath, downloadingName);

    await fse.ensureFile(downloadingPath);
    await pipeline(requestedDistributionUrl, downloadingPath);
    await verifyHash(shaSum, downloadingPath);

    await extractNeo4j(downloadingPath, neo4jDistributionPath);

    await fse.remove(downloadingPath);
};
