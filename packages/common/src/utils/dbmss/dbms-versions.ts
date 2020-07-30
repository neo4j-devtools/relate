import {promises as fs} from 'fs';
import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import semver from 'semver';
import {Dict, List, None} from '@relate/types';

import {DependencyError, InvalidArgumentError} from '../../errors';
import {IDbmsVersion} from '../../models';
import {
    NEO4J_DIST_VERSIONS_URL,
    NEO4J_EDITION,
    NEO4J_ORIGIN,
    NEO4J_SUPPORTED_VERSION_RANGE,
    NEO4J_DIST_LIMITED_VERSIONS_URL,
    NEO4J_LIB_DIR,
} from '../../entities/environments';

export const getDistributionInfo = async (dbmsRootDir: string): Promise<IDbmsVersion | null> => {
    try {
        const version = await getDistributionVersion(dbmsRootDir);
        const isEnterprise = await fse.pathExists(
            path.join(dbmsRootDir, NEO4J_LIB_DIR, `neo4j-server-enterprise-${version}.jar`),
        );

        return {
            dist: dbmsRootDir,
            edition: isEnterprise ? NEO4J_EDITION.ENTERPRISE : NEO4J_EDITION.COMMUNITY,
            origin: NEO4J_ORIGIN.CACHED,
            version,
        };
    } catch (e) {
        if (e.name === DependencyError.name) {
            throw e;
        }

        return null;
    }
};

export const discoverNeo4jDistributions = async (distributionsRoot: string): Promise<List<IDbmsVersion>> => {
    const files = List.from(await fs.readdir(distributionsRoot, {withFileTypes: true}));
    const dists = await files
        .filter((file) => file.isDirectory())
        .mapEach((dir) => {
            const dbmsRootDir = path.join(distributionsRoot, dir.name);

            return getDistributionInfo(dbmsRootDir);
        })
        .unwindPromises();

    return dists.compact().filter((dist) => semver.satisfies(dist.version, NEO4J_SUPPORTED_VERSION_RANGE));
};

interface IVersions {
    [version: string]: {
        version: string;
        releaseNotes: string;
        limited: boolean;
        latest: boolean;
        dist: {
            mac: string;
            win: string;
            linux: string;
        };
    };
}

interface IVersionManifest {
    'dist-tags': {
        [tag: string]: string;
    };
    versions: IVersions;
}

export const fetchNeo4jVersions = async (limited = false): Promise<List<IDbmsVersion>> => {
    const versionsUrls = [NEO4J_DIST_VERSIONS_URL];

    if (limited) {
        // @todo: this isn't an active url yet - https://trello.com/c/uVg2EuT5
        versionsUrls.push(NEO4J_DIST_LIMITED_VERSIONS_URL);
    }

    const versionsUrlsResponses: List<IVersionManifest> = await List.from(versionsUrls)
        .mapEach((url) =>
            got(url)
                .json()
                .catch(() => None.of({})),
        )
        .unwindPromises();

    const versionManifest: IVersions = versionsUrlsResponses.compact().reduce((verManifest, verResponse) => {
        return {
            ...verManifest,
            ...verResponse.versions,
        };
    }, {});

    return Dict.from(versionManifest)
        .toList()
        .filter(([versionStr]) => semver.satisfies(versionStr, NEO4J_SUPPORTED_VERSION_RANGE))
        .mapEach(([versionStr, versionObj]) => {
            let url = versionObj.dist.linux;

            if (process.platform === 'darwin') {
                url = versionObj.dist.mac;
            }

            if (process.platform === 'win32') {
                url = versionObj.dist.win;
            }

            return {
                dist: url,
                edition: NEO4J_EDITION.ENTERPRISE,
                origin: versionObj.limited ? NEO4J_ORIGIN.LIMITED : NEO4J_ORIGIN.ONLINE,
                version: versionStr,
            };
        });
};

export async function getDistributionVersion(dbmsRoot: string): Promise<string> {
    const semverRegex = /[0-9]+\.[0-9]+\.[0-9]+/;
    const neo4jJarRegex = /^neo4j-server-[0-9]+\.[0-9]+\.[0-9]+\.jar$/;
    const libs = List.from(await fse.readdir(path.join(dbmsRoot, NEO4J_LIB_DIR)));
    const neo4jJar = libs.find((name) => neo4jJarRegex.test(name));

    return neo4jJar
        .flatMap((jar) => {
            if (None.isNone(jar)) {
                throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
            }

            return List.from(jar.match(semverRegex)).first;
        })
        .flatMap((version) => {
            if (None.isNone(version)) {
                throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
            }

            return version;
        });
}
