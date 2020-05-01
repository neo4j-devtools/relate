
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
import { FetchError, NotEqualError } from '../../../errors';

export const downloadNeo4j = async (version: string, neo4jDistributionPath: string): Promise<void> => {
  const onlineVersions = await fetchNeo4jVersions();
  const requestedDistribution = _.find(
      onlineVersions,
      (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === version,
  );

  const requestedDistributionUrl = requestedDistribution!.dist;
  const shaSum = await getCheckSum(`${requestedDistributionUrl}.${NEO4J_SHA_ALGORITHM}`);

  // just so its obvious that its currently in progress.
  const tmpName = uuidv4();
  // output to tmp dir initially instead of neo4jDistribution dir?
  const tmpPath = path.join(neo4jDistributionPath, tmpName);

  const archiveName = `neo4j-${requestedDistribution!.edition}-${requestedDistribution!.version}${NEO4J_ARCHIVE_FILE_SUFFIX}`;
  const archivePath = path.join(neo4jDistributionPath, archiveName);

  const pipeline = promisify(stream.pipeline);

  try {
    await pipeline(
        got.stream(requestedDistributionUrl),
        fse.createWriteStream(tmpPath)
    );
  } catch (e) {
    // remove tmp output
    await fse.remove(tmpPath);
    throw new FetchError(e);
  }

  try {
    await verifyHash(shaSum, tmpPath);
  } catch (e) {
    // remove tmp output
    await fse.remove(tmpPath);
    throw e;
  }

  // rename the tmp output
  await fse.rename(tmpPath, archivePath);
  // extract to cache dir
  await extractFromArchive(archivePath, neo4jDistributionPath);
  // remove tmp output
  return fse.remove(tmpPath);
}

export const getCheckSum = async (url: string): Promise<string> => {
  try {
      const response = await got(url);
      const {body: shaSum} = response;
      return shaSum;
  } catch (e) {
      throw new FetchError(e);
  }
}

export const verifyHash = async (expectedShasumHash: string, pathToFile: string, algorithm = NEO4J_SHA_ALGORITHM): Promise<string> => {
  const hash = await hasha.fromFile(pathToFile, {algorithm});
  if (hash !== expectedShasumHash) {
      throw new NotEqualError('Expected hash mismatch');
  }
  return hash;
}
