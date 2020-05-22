import _ from 'lodash';
import fse from 'fs-extra';
import {promises as fs} from 'fs';
import got from 'got';
import path from 'path';
import semver from 'semver';

import {
    NEO4J_DIST_VERSIONS_URL,
    NEO4J_SUPPORTED_VERSION_RANGE,
    NEO4J_EDITION,
    NEO4J_ORIGIN,
} from '../../environment.constants';
import {IDbmsVersion} from '../../../models';
import {DependencyError, InvalidArgumentError} from '../../../errors';

export const getDistributionInfo = async (dbmsRootDir: string): Promise<IDbmsVersion | null> => {
    try {
        const version = await getDistributionVersion(dbmsRootDir);

        if (!version) {
            return null;
        }

        const isEnterprise = await fse.pathExists(
            path.join(dbmsRootDir, 'lib', `neo4j-server-enterprise-${version}.jar`),
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

export const discoverNeo4jDistributions = async (distributionsRoot: string): Promise<IDbmsVersion[]> => {
    const files = await fs.readdir(distributionsRoot, {withFileTypes: true});
    const dirs = _.filter(files, (file) => file.isDirectory());

    const distPromises = _.map(dirs, (dir) => {
        const dbmsRootDir = path.join(distributionsRoot, dir.name);
        return getDistributionInfo(dbmsRootDir);
    });

    // Typescript won't understand that I'm trying to filter out null values.
    const notNull = <TValue>(value: TValue | null | undefined): value is TValue => {
        return value !== null && value !== undefined;
    };
    const dists = _.filter(await Promise.all(distPromises), notNull);

    return dists.filter((dist) => semver.satisfies(dist.version, NEO4J_SUPPORTED_VERSION_RANGE));
};

interface IVersionManifest {
    'dist-tags': {
        [tag: string]: string;
    };
    versions: {
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
    };
}

export const fetchNeo4jVersions = async (): Promise<IDbmsVersion[]> => {
    let versionManifest: IVersionManifest;
    try {
        versionManifest = await got(NEO4J_DIST_VERSIONS_URL).json();
    } catch {
        return [];
    }

    const validVersions = Object.entries(versionManifest.versions).filter(([versionStr]) =>
        semver.satisfies(versionStr, NEO4J_SUPPORTED_VERSION_RANGE),
    );

    return validVersions.map(([versionStr, versionObj]) => {
        let url = versionObj.dist.linux;

        if (process.platform === 'darwin') {
            url = versionObj.dist.mac;
        }

        if (process.platform === 'win32') {
            url = versionObj.dist.win;
        }

        return {
            dist: url,
            edition: url.includes(NEO4J_EDITION.ENTERPRISE) ? NEO4J_EDITION.ENTERPRISE : NEO4J_EDITION.COMMUNITY,
            origin: NEO4J_ORIGIN.ONLINE,
            version: versionStr,
        };
    });
};

export async function getDistributionVersion(dbmsRoot: string): Promise<string> {
    const SEMVER_REGEX = /[0-9]+\.[0-9]+\.[0-9]+/;
    const NEO4j_JAR_REGEX = /^neo4j-[0-9]+\.[0-9]+\.[0-9]+\.jar$/;
    const libs = await fse.readdir(path.join(dbmsRoot, 'lib'));
    const neo4jJar = _.find(libs, (name) => NEO4j_JAR_REGEX.test(name));

    if (!neo4jJar) {
        throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
    }

    const version = semver.valid(_.head(neo4jJar.match(SEMVER_REGEX)));

    if (!version) {
        throw new InvalidArgumentError(`Could not parse version`);
    }

    return version;
}
