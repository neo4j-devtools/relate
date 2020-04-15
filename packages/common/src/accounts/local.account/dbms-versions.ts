import _ from 'lodash';
import fse from 'fs-extra';
import got from 'got';
import path from 'path';

import {NEO4J_DIST_VERSIONS_URL, NEO4J_DISTRIBUTION_REGEX} from '../account.constants';

export interface INeo4jDistribution {
    version: string;
    edition: string;
}

export const getDownloadedNeo4jDistributions = async (cachePath: string): Promise<INeo4jDistribution[] | []> => {
    await fse.ensureDir(path.join(cachePath, 'neo4j'));
    const fileNames = await fse.readdir(path.join(cachePath, 'neo4j'));
    const fileNamesFilter = _.filter(fileNames, (fileName) =>
        fileName.endsWith(process.platform === 'win32' ? '.zip' : '.tar.gz'),
    );
    return _.reduce(
        fileNamesFilter,
        (acc: INeo4jDistribution[], fileName: string) => {
            const match = fileName.match(NEO4J_DISTRIBUTION_REGEX);
            if (match) {
                const [, edition, version] = match;
                acc.push({
                    edition,
                    version,
                });
                return acc;
            }
            return acc;
        },
        [],
    );
};

export interface INeo4jVersion {
    version: string;
    releaseNotes: string;
    dist: INeo4jDists;
    limited: boolean;
    latest: boolean;
}

export interface INeo4jDists {
    mac: string;
    win: string;
    linux: string;
}

export const fetchNeo4jVersions = async (): Promise<INeo4jVersion[] | []> => {
    await got(NEO4J_DIST_VERSIONS_URL);
    return [];
};
