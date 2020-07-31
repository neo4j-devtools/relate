import fse from 'fs-extra';
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
    await fse.copy(`${dbms.rootPath}/certificates`, `${upgradedDbms.rootPath}/certificates`);
    await fse.copy(`${dbms.rootPath}/data`, `${upgradedDbms.rootPath}/data`);
    await fse.copy(`${dbms.rootPath}/logs`, `${upgradedDbms.rootPath}/logs`);
    await fse.copy(`${dbms.rootPath}/conf`, `${upgradedDbms.rootPath}/conf`);
    await fse.copy(`${dbms.rootPath}/plugins`, `${upgradedDbms.rootPath}/plugins`);

    const certExists = await fse.pathExists(`${dbms.rootPath!}/certificates/neo4j.cert`);
    const keyExists = await fse.pathExists(`${dbms.rootPath!}/certificates/neo4j.key`);

    if (certExists && keyExists) {
        await fse.copy(
            `${dbms.rootPath}/certificates/neo4j.cert`,
            `${upgradedDbms.rootPath}/certificates/https/neo4j.cert`,
        );
        await fse.copy(
            `${dbms.rootPath}/certificates/neo4j.key`,
            `${upgradedDbms.rootPath}/certificates/https/neo4j.key`,
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
