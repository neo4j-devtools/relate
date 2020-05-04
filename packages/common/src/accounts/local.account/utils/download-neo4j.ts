import _ from 'lodash';
import fse from 'fs-extra';
import got from 'got';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import stream from 'stream';
import {promisify} from 'util';
import hasha from 'hasha';

import {NEO4J_EDITION, NEO4J_SHA_ALGORITHM, NEO4J_ARCHIVE_FILE_SUFFIX} from '../../account.constants';
import {fetchNeo4jVersions} from './dbms-versions';
import {extractFromArchive} from './extract-neo4j';
import {FetchError, IntegrityError, NotFoundError} from '../../../errors';

export const getCheckSum = async (url: string): Promise<string> => {
    try {
        const response = await got(url);
        const {body: shaSum} = response;
        return shaSum;
    } catch (e) {
        throw new FetchError(e);
    }
};

export const pipeline = async (url: string, outputPath: string): Promise<void> => {
    const streamPipeline = promisify(stream.pipeline);

    try {
        await streamPipeline(got.stream(url), fse.createWriteStream(outputPath));
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

    // just so its obvious that its currently in progress.
    const tmpName = uuidv4();
    // output to tmp dir initially instead of neo4jDistribution dir?
    const tmpPath = path.join(neo4jDistributionPath, tmpName);

    // download and pipe to tmpPath
    await pipeline(requestedDistributionUrl, tmpPath);
    // verify the hash
    await verifyHash(shaSum, tmpPath);

    // extract to cache dir first
    const info = await extractFromArchive(tmpPath, neo4jDistributionPath);
    const archiveName = `neo4j-${info.edition}-${info.version}${NEO4J_ARCHIVE_FILE_SUFFIX}`;
    const archivePath = path.join(neo4jDistributionPath, archiveName);
    // rename the tmp output
    await fse.rename(tmpPath, archivePath);
    // remove tmp output
    return fse.remove(tmpPath);
};
