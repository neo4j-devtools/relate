import fse from 'fs-extra';
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
import {requestJson} from '../download';

export const getDistributionInfo = async (dbmsRootDir: string): Promise<IDbmsVersion | null> => {
    try {
        const {version, prerelease} = await getDistributionVersion(dbmsRootDir);
        const neo4jEnterpriseJar = prerelease
            ? `neo4j-server-enterprise-${version}-${prerelease}.jar`
            : `neo4j-server-enterprise-${version}.jar`;

        const isEnterprise = await fse.pathExists(path.join(dbmsRootDir, NEO4J_LIB_DIR, neo4jEnterpriseJar));

        return {
            dist: dbmsRootDir,
            edition: isEnterprise ? NEO4J_EDITION.ENTERPRISE : NEO4J_EDITION.COMMUNITY,
            origin: NEO4J_ORIGIN.CACHED,
            version,
            prerelease,
        };
    } catch (e) {
        if (e.name === DependencyError.name) {
            throw e;
        }

        return null;
    }
};

export const discoverNeo4jDistributions = async (distributionsRoot: string): Promise<List<IDbmsVersion>> => {
    const files = List.from(await fse.readdir(distributionsRoot, {withFileTypes: true}));
    const dists = await files
        .filter((file) => file.isDirectory())
        .mapEach((dir) => {
            const dbmsRootDir = path.join(distributionsRoot, dir.name);

            return getDistributionInfo(dbmsRootDir);
        })
        .unwindPromises();

    return dists.compact().filter((dist) =>
        semver.satisfies(dist.version, NEO4J_SUPPORTED_VERSION_RANGE, {
            includePrerelease: true,
        }),
    );
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
        .mapEach((url) => requestJson(url).catch(() => None.of({})))
        .unwindPromises();

    const versionManifest: IVersions = versionsUrlsResponses.compact().reduce((verManifest, verResponse) => {
        return {
            ...verManifest,
            ...verResponse.versions,
        };
    }, {});

    return Dict.from(versionManifest)
        .toList()
        .filter(([versionStr]) =>
            semver.satisfies(versionStr, NEO4J_SUPPORTED_VERSION_RANGE, {
                includePrerelease: true,
            }),
        )
        .mapEach(([versionStr, versionObj]) => {
            let url = versionObj.dist.linux;

            if (process.platform === 'darwin') {
                url = versionObj.dist.mac;
            }

            if (process.platform === 'win32') {
                url = versionObj.dist.win;
            }

            const [version, prerelease] = versionStr.split('-');

            return {
                dist: url,
                edition: NEO4J_EDITION.ENTERPRISE,
                origin: versionObj.limited ? NEO4J_ORIGIN.LIMITED : NEO4J_ORIGIN.ONLINE,
                version,
                prerelease,
            };
        });
};

export async function getDistributionVersion(dbmsRoot: string): Promise<{version: string; prerelease?: string}> {
    const semverRegex = /([0-9]+\.[0-9]+\.[0-9]+)(-\w+.(\d))?/;
    const neo4jJarRegex = /^neo4j-server-[0-9]+\.[0-9]+\.[0-9]+(-\w.+)?\.jar$/;
    const libs = List.from(await fse.readdir(path.join(dbmsRoot, NEO4J_LIB_DIR)));
    const neo4jJar = libs.find((name) => neo4jJarRegex.test(name));

    return neo4jJar.flatMap((jar) => {
        if (None.isNone(jar)) {
            throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
        }

        // If there is no match this list will be empty.
        // If there is a match, the first element will be the full match, and
        // then the following elements are the captured groups.
        const capture = List.from(jar.match(semverRegex));
        const version = capture.nth(1).getOrElse(() => {
            throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
        });
        const prerelease = capture.nth(2).getOrElse(() => undefined);

        return {
            version,
            prerelease: prerelease ? prerelease.substring(1, prerelease.length) : undefined,
        };
    });
}
