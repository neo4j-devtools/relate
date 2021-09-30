import fse from 'fs-extra';
import {Str} from '@relate/types';

import {NEO4J_EDITION, NEO4J_SHA_ALGORITHM} from '../../entities/environments/environment.constants';
import {HOOK_EVENTS} from '../../constants';
import {FetchError, NotFoundError} from '../../errors';
import {download, request, verifyHash} from '../download';
import {emitHookEvent} from '../event-hooks';
import {fetchNeo4jVersions} from './dbms-versions';
import {extractNeo4j} from './extract-neo4j';

export const getCheckSum = async (url: string): Promise<string> => {
    try {
        const response = await request(url);
        const {body: shaSum} = response;
        return Str.from(shaSum).trim().get();
    } catch (e) {
        throw new FetchError(e);
    }
};

export const downloadNeo4j = async (
    version: string,
    edition: NEO4J_EDITION,
    neo4jDistributionPath: string,
    limited?: boolean,
): Promise<void> => {
    const onlineVersions = await fetchNeo4jVersions(limited);
    const requestedDistribution = onlineVersions.find((dist) => dist.version === version && dist.edition === edition);
    const errorMessage = () => {
        const mappedVersions = onlineVersions
            .mapEach((dist) => `${dist.version}-${dist.edition}`)
            .join(', ')
            .map((versions) => `Use a valid version found online: ${versions}`)
            .getOrElse(`Use a valid version`);

        throw new NotFoundError(`Unable to find the requested version: ${version}-${edition} online`, [mappedVersions]);
    };

    const dist = requestedDistribution.getOrElse(errorMessage);
    const requestedDistributionUrl = dist.dist;

    await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, null);
    const downloadFilePath = await download(requestedDistributionUrl, neo4jDistributionPath);
    await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, null);
    const shaSum = await getCheckSum(`${requestedDistributionUrl}.${NEO4J_SHA_ALGORITHM}`);
    await verifyHash(shaSum, downloadFilePath);

    await extractNeo4j(downloadFilePath, neo4jDistributionPath);
    return fse.remove(downloadFilePath);
};
