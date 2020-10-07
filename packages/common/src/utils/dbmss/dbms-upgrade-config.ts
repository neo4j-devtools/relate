import fse from 'fs-extra';
import path from 'path';
import semver from 'semver';

import {IDbmsInfo} from '../../models';
import {NEO4J_VERSION_4} from '../../entities/environments';
import {PropertiesFile} from '../../system/files';

/**
 * Following copy operations moved over from Neo4j Desktop
 */
export async function dbmsUpgradeConfigs(
    dbms: IDbmsInfo,
    upgradedDbms: IDbmsInfo,
    upgradedConfig: PropertiesFile,
): Promise<IDbmsInfo> {
    if (!dbms.rootPath) {
        throw Error(`Cannot find root path for the original DBMS [${dbms.id}] "${dbms.name}"`);
    }

    if (!upgradedDbms.rootPath) {
        throw Error(`Cannot find root path for the upgraded DBMS [${dbms.id}] "${dbms.name}"`);
    }

    const copyDBMSPath = (sourceRootPath: string, destinationRootPath: string, ...paths: string[]) =>
        fse.copy(path.join(sourceRootPath, ...paths), path.join(destinationRootPath, ...paths));

    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, 'data');
    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, 'logs');
    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, 'conf');
    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, 'plugins');

    const certsExists = await fse.pathExists(path.join(dbms.rootPath, 'certificates'));

    if (certsExists) {
        await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, 'certificates');
    }

    const certExists = await fse.pathExists(path.join(dbms.rootPath, 'certificates', 'neo4j.cert'));
    const keyExists = await fse.pathExists(path.join(dbms.rootPath, 'certificates', 'neo4j.key'));

    if (certExists && keyExists) {
        await fse.copy(
            path.join(dbms.rootPath, 'certificates', 'neo4j.cert'),
            path.join(upgradedDbms.rootPath, 'certificates', 'https', 'neo4j.cert'),
        );
        await fse.copy(
            path.join(dbms.rootPath, 'certificates', 'neo4j.key'),
            path.join(upgradedDbms.rootPath, 'certificates', 'https', 'neo4j.key'),
        );
    }

    if (semver.lt(dbms.version!, NEO4J_VERSION_4) && semver.gte(upgradedDbms.version!, NEO4J_VERSION_4)) {
        if (dbms.secure) {
            upgradedConfig.set('dbms.default_database', 'graph.db');
            upgradedConfig.set('dbms.security.auth_enabled', 'true');
            upgradedConfig.set('dbms.ssl.policy.https.enabled', 'true');
            upgradedConfig.set('dbms.ssl.policy.https.base_directory', 'certificates/https');
            upgradedConfig.set('dbms.ssl.policy.https.private_key', 'neo4j.key');
            upgradedConfig.set('dbms.ssl.policy.https.public_certificate', 'neo4j.cert');
        } else {
            upgradedConfig.set('dbms.security.auth_enabled', 'false');
        }
        await upgradedConfig.flush();
    }

    return upgradedDbms;
}
