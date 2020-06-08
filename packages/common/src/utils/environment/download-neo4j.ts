import fse from 'fs-extra';
import got from 'got';
import hasha from 'hasha';

import {NEO4J_EDITION, NEO4J_SHA_ALGORITHM} from '../../environments/environment.constants';
import {HOOK_EVENTS} from '../../constants';
import {FetchError, IntegrityError, NotFoundError} from '../../errors';
import {download} from '../download';
import {emitHookEvent} from '../event-hooks';
import {fetchNeo4jVersions} from './dbms-versions';
import {extractNeo4j} from './extract-neo4j';
import {None, List} from '@relate/types';

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
    const requestedDistribution = onlineVersions.find(
        (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === version,
    );
    const errorMessage = () => {
        const onlineEnterpriseVersions = onlineVersions
            .filter((dist) => dist.edition === NEO4J_EDITION.ENTERPRISE)
            .mapEach((dist) => dist.version)
            .join(', ');
        let messages = [];
        if (!onlineEnterpriseVersions.isEmpty) {
            messages.push(
                `Use a relevant ${NEO4J_EDITION.ENTERPRISE} version found online: ${onlineEnterpriseVersions}`,
            );
        }
        throw new NotFoundError(`Unable to find the requested version: ${version} online`, messages);
    };

    return requestedDistribution
        .flatMap((dist) => {
            if (None.isNone(dist)) {
                return errorMessage();
            }

            return List.from([dist]).first;
        })
        .flatMap(async (dist) => {
            if (None.isNone(dist)) {
                return errorMessage();
            }

            const requestedDistributionUrl = dist.dist;
            const shaSum = await getCheckSum(`${requestedDistributionUrl}.${NEO4J_SHA_ALGORITHM}`);

            await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, null);
            const downloadFilePath = await download(requestedDistributionUrl, neo4jDistributionPath);
            await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, null);
            await verifyHash(shaSum, downloadFilePath);

            await extractNeo4j(downloadFilePath, neo4jDistributionPath);
            return fse.remove(downloadFilePath);
        });
};
