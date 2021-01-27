import fse from 'fs-extra';
import got from 'got';
import {isArray} from 'lodash';
import path from 'path';
import semver from 'semver';
import {List} from '@relate/types';

import {DbmsPluginVersionModel, IDbmsInfo, IDbmsPluginSource, IDbmsPluginVersion} from '../../models';
import {NotFoundError} from '../../errors';

export async function listVersions(
    pluginsDir: string,
    pluginSource: IDbmsPluginSource,
): Promise<List<IDbmsPluginVersion>> {
    const cachedVersionsFile = path.join(pluginsDir, `${pluginSource.name}.json`);
    const rawVersions = await got(pluginSource.versionsUrl)
        .json()
        .catch(() => null);

    if (!rawVersions || !isArray(rawVersions)) {
        if (await fse.pathExists(cachedVersionsFile)) {
            return List.from<IDbmsPluginVersion>(await fse.readJSON(cachedVersionsFile)).mapEach(
                (version) => new DbmsPluginVersionModel(version),
            );
        }

        return List.from([]);
    }

    const versions = List.from(rawVersions).mapEach((version) => new DbmsPluginVersionModel(version));

    await fse.ensureFile(cachedVersionsFile);
    await fse.writeJSON(cachedVersionsFile, versions);

    return versions;
}

export function getLatestCompatibleVersion(
    dbms: IDbmsInfo,
    pluginSource: IDbmsPluginSource,
    pluginVersions: List<IDbmsPluginVersion>,
): IDbmsPluginVersion {
    const dbmsVersion = dbms.version;
    if (!dbmsVersion) {
        throw new NotFoundError(`Could not get version for DBMS "${dbms.name}"`);
    }

    const latestCompatibleVersion = pluginVersions
        .filter((plugin) => semver.satisfies(dbmsVersion, plugin.neo4jVersion))
        .reduce<IDbmsPluginVersion | null>((newest, current) => {
            if (!newest || semver.gt(current.version, newest.version)) {
                return current;
            }

            return newest;
        }, null);

    if (!latestCompatibleVersion) {
        throw new NotFoundError(
            `Could not find any version of ${pluginSource.name} compatible with Neo4j ${dbms.version}`,
        );
    }

    return latestCompatibleVersion;
}
