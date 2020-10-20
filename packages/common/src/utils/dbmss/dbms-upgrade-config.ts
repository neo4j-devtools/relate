import fse from 'fs-extra';
import path from 'path';
import semver from 'semver';

import {IDbmsInfo} from '../../models';
import {
    NEO4J_CERT_DIR,
    NEO4J_CONF_DIR,
    NEO4J_DATA_DIR,
    NEO4J_JWT_ADDON_NAME,
    NEO4J_JWT_ADDON_VERSION,
    NEO4J_JWT_CONF_FILE,
    NEO4J_LOGS_DIR,
    NEO4J_PLUGIN_DIR,
    NEO4J_VERSION_4,
} from '../../entities/environments';
import {PropertiesFile} from '../../system/files';

/**
 * Following copy operations moved over from Neo4j Desktop
 */
export async function dbmsUpgradeConfigs(
    dbms: IDbmsInfo,
    upgradedDbms: IDbmsInfo,
    upgradedConfigFileName: string,
): Promise<IDbmsInfo> {
    if (!dbms.rootPath) {
        throw Error(`Cannot find root path for the original DBMS [${dbms.id}] "${dbms.name}"`);
    }

    if (!upgradedDbms.rootPath) {
        throw Error(`Cannot find root path for the upgraded DBMS [${dbms.id}] "${dbms.name}"`);
    }

    const copyDBMSPath = (sourceRootPath: string, destinationRootPath: string, ...paths: string[]) =>
        fse.copy(path.join(sourceRootPath, ...paths), path.join(destinationRootPath, ...paths), {overwrite: true});

    await migrateJwtPlugin(dbms, upgradedDbms);

    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, NEO4J_DATA_DIR);
    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, NEO4J_LOGS_DIR);
    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, NEO4J_CONF_DIR);
    await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, NEO4J_PLUGIN_DIR);

    const certsExists = await fse.pathExists(path.join(dbms.rootPath, NEO4J_CERT_DIR));

    if (certsExists) {
        await copyDBMSPath(dbms.rootPath, upgradedDbms.rootPath, NEO4J_CERT_DIR);
    }

    const certExists = await fse.pathExists(path.join(upgradedDbms.rootPath, NEO4J_CERT_DIR, 'neo4j.cert'));
    const keyExists = await fse.pathExists(path.join(upgradedDbms.rootPath, NEO4J_CERT_DIR, 'neo4j.key'));

    if (semver.lt(dbms.version!, NEO4J_VERSION_4) && semver.gte(upgradedDbms.version!, NEO4J_VERSION_4)) {
        const upgradedConfig = await PropertiesFile.readFile(upgradedConfigFileName);

        if (certExists && keyExists) {
            await fse.copy(
                path.join(upgradedDbms.rootPath, NEO4J_CERT_DIR, 'neo4j.cert'),
                path.join(upgradedDbms.rootPath, NEO4J_CERT_DIR, 'https', 'neo4j.cert'),
            );
            await fse.copy(
                path.join(upgradedDbms.rootPath, NEO4J_CERT_DIR, 'neo4j.key'),
                path.join(upgradedDbms.rootPath, NEO4J_CERT_DIR, 'https', 'neo4j.key'),
            );

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

async function migrateJwtPlugin(dbms: IDbmsInfo, upgradedDbms: IDbmsInfo): Promise<void> {
    if (!dbms.rootPath) {
        throw Error(`Cannot find root path for the original DBMS [${dbms.id}] "${dbms.name}"`);
    }

    if (!upgradedDbms.rootPath) {
        throw Error(`Cannot find root path for the upgraded DBMS [${dbms.id}] "${dbms.name}"`);
    }

    const oldSecurityPluginPath = path.join(
        dbms.rootPath,
        NEO4J_PLUGIN_DIR,
        `${NEO4J_JWT_ADDON_NAME}-${NEO4J_JWT_ADDON_VERSION}.jar`,
    );

    const oldHasPlugin = await fse.pathExists(oldSecurityPluginPath);

    if (!oldHasPlugin) {
        return;
    }

    await fse.remove(oldSecurityPluginPath);

    const oldJwtConfigPath = path.join(dbms.rootPath, NEO4J_CONF_DIR, NEO4J_JWT_CONF_FILE);
    const oldJwtConfig = await PropertiesFile.readFile(path.join(oldJwtConfigPath));
    const newJwtConfigPath = path.join(dbms.rootPath, NEO4J_CONF_DIR, NEO4J_JWT_CONF_FILE);

    await fse.ensureFile(newJwtConfigPath);

    const newJwtConfig = await PropertiesFile.readFile(path.join(newJwtConfigPath));

    if (oldJwtConfig.get(`jwt.auth.public_key`) && oldJwtConfig.get(`jwt.auth.private_key`)) {
        newJwtConfig.set(`jwt.auth.public_key`, oldJwtConfig.get(`jwt.auth.public_key`)!);
        newJwtConfig.set(`jwt.auth.private_key`, oldJwtConfig.get(`jwt.auth.private_key`)!);
        newJwtConfig.set(`jwt.auth.private_key_password`, oldJwtConfig.get(`jwt.auth.private_key_password`)!);
    }

    await fse.remove(oldJwtConfigPath);
    await newJwtConfig.flush();
}
