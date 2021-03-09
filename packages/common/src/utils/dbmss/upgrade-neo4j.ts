import semver from 'semver';
import fse from 'fs-extra';
import path from 'path';

import {DBMS_STATUS, ENTITY_TYPES, HOOK_EVENTS} from '../../constants';
import {LocalEnvironment, NEO4J_CONF_DIR, NEO4J_CONF_FILE, NEO4J_PLUGIN_DIR} from '../../entities/environments';
import {DbmsUpgradeError, InvalidArgumentError, NotFoundError, RelateBackupError} from '../../errors';
import {emitHookEvent} from '../event-hooks';
import {dbmsUpgradeConfigs} from './dbms-upgrade-config';
import {waitForDbmsToBeOnline} from './is-dbms-online';
import {resolveDbms} from './resolve-dbms';
import {IDbmsInfo, IDbmsUpgradeOptions, PLUGIN_UPGRADE_MODE} from '../../models';

const upgradePlugins = async (
    env: LocalEnvironment,
    originalDbms: IDbmsInfo,
    upgradedDbms: IDbmsInfo,
    pluginUpgradeMode: PLUGIN_UPGRADE_MODE = PLUGIN_UPGRADE_MODE.UPGRADABLE,
): Promise<void> => {
    if (pluginUpgradeMode === PLUGIN_UPGRADE_MODE.NONE) {
        return;
    }

    const existingPlugins = await env.dbmsPlugins.list(originalDbms.id);
    await existingPlugins
        .mapEach(async (plugin) => {
            try {
                await env.dbmsPlugins.install([upgradedDbms.id], plugin.name);
            } catch (err) {
                await emitHookEvent(HOOK_EVENTS.DEBUG, `could not install plugin ${plugin.name}: ${err}`);

                if (!originalDbms.rootPath) {
                    throw new NotFoundError(`Could not find DBMS root path for ${originalDbms.name}`);
                }

                if (!upgradedDbms.rootPath) {
                    throw new NotFoundError(`Could not find DBMS root path for ${upgradedDbms.name}`);
                }

                if (pluginUpgradeMode === PLUGIN_UPGRADE_MODE.ALL) {
                    const pluginFilename = env.dbmsPlugins.getDbmsPluginFilename(plugin);
                    const originalPluginPath = path.join(originalDbms.rootPath, NEO4J_PLUGIN_DIR, pluginFilename);
                    const upgradedPluginPath = path.join(upgradedDbms.rootPath, NEO4J_PLUGIN_DIR, pluginFilename);

                    await fse.copy(originalPluginPath, upgradedPluginPath);
                }
            }
        })
        .unwindPromises();
};

export const upgradeNeo4j = async (
    env: LocalEnvironment,
    dbmsId: string,
    version: string,
    options: IDbmsUpgradeOptions,
): Promise<IDbmsInfo> => {
    const dbms = await env.dbmss.get(dbmsId);
    const dbmsManifest = await env.dbmss.manifest.get(dbmsId);

    if (semver.lte(version, dbms.version!)) {
        throw new InvalidArgumentError(`Target version must be greater than ${dbms.version}`, ['Use valid version']);
    }

    if (dbms.status !== DBMS_STATUS.STOPPED) {
        throw new InvalidArgumentError(`Can only upgrade stopped dbms`, ['Stop dbms']);
    }

    const {entityType, entityId} = await emitHookEvent(HOOK_EVENTS.BACKUP_START, {
        entityType: ENTITY_TYPES.DBMS,
        entityId: dbms.id,
    });
    const dbmsBackup = await env.backups.create(entityType, entityId);
    const {backup: completeBackup} = await emitHookEvent(HOOK_EVENTS.BACKUP_COMPLETE, {backup: dbmsBackup});

    const upgradeTmpName = `[Upgrade ${version}] ${dbms.name}`;

    try {
        const upgradedDbmsInfo = await env.dbmss.install(upgradeTmpName, version, dbms.edition!, '', options.noCache);
        const upgradedConfigFileName = path.join(
            env.dbmss.getDbmsRootPath(upgradedDbmsInfo.id),
            NEO4J_CONF_DIR,
            NEO4J_CONF_FILE,
        );

        await dbmsUpgradeConfigs(dbms, upgradedDbmsInfo, upgradedConfigFileName);
        const upgradedConfig = await env.dbmss.getDbmsConfig(upgradedDbmsInfo.id);

        /**
         * Run Neo4j migration?
         */
        if (options.migrate) {
            upgradedConfig.set('dbms.allow_upgrade', 'true');
            await upgradedConfig.flush();
            const upgradedDbms = resolveDbms(env.dbmss.dbmss, upgradedDbmsInfo.id);

            await emitHookEvent(HOOK_EVENTS.DBMS_MIGRATION_START, {dbms: upgradedDbms});

            await env.dbmss.start([upgradedDbms.id]);
            await waitForDbmsToBeOnline(upgradedDbms);
            await env.dbmss.stop([upgradedDbms.id]);

            await emitHookEvent(HOOK_EVENTS.DBMS_MIGRATION_STOP, {dbms: upgradedDbms});

            await upgradedConfig.flush();
        } else {
            upgradedConfig.set('dbms.allow_upgrade', 'false');
            await upgradedConfig.flush();
        }

        // Install new plugins
        await upgradePlugins(env, dbms, upgradedDbmsInfo, options.pluginUpgradeMode);

        /**
         * Replace old installation
         */
        await env.dbmss.uninstall(dbms.id);
        await fse.move(upgradedDbmsInfo.rootPath!, dbms.rootPath!);
        await env.dbmss.manifest.update(dbms.id, {
            ...dbmsManifest,
            name: dbms.name,
        });

        if (!options.backup) {
            await env.backups.remove(completeBackup.id);
        }

        return env.dbmss.get(dbms.id);
    } catch (e) {
        if (e instanceof RelateBackupError) {
            throw e;
        }

        await env.dbmss
            .get(upgradeTmpName)
            .then(({id}) => env.dbmss.uninstall(id))
            .catch(() => null);
        await env.dbmss.uninstall(dbms.id).catch(() => null);

        const restored = await env.backups.restore(completeBackup.directory);

        await fse.move(env.dbmss.getDbmsRootPath(restored.entityId)!, dbms.rootPath!);
        await env.dbmss.manifest.update(dbms.id, {
            name: dbms.name,
        });

        throw new DbmsUpgradeError(`Failed to upgrade dbms ${dbms.id}`, e.message, [
            `DBMS was restored from backup ${completeBackup.id}`,
        ]);
    }
};
