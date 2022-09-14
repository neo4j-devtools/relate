import nock from 'nock';
import {major, minor, patch} from 'semver';

import {InvalidArgumentError} from '../../errors';
import {TestEnvironment, TEST_APOC_VERSIONS, TEST_NEO4J_VERSIONS} from '../../utils/system';
import {IDbmsInfo, PLUGIN_UPGRADE_MODE} from '../../models';
import {EnvironmentAbstract} from '../environments';

jest.setTimeout(240000);

describe('LocalDbmss - upgrade', () => {
    let app: TestEnvironment;
    let env: EnvironmentAbstract;

    let dbmsMajor: IDbmsInfo;
    let dbmsMinor: IDbmsInfo;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
        env = app.environment;

        dbmsMajor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.majorUpgradeSource);
        dbmsMinor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.minorUpgradeSource);
    });

    afterAll(async () => {
        await app.teardown();
    });

    test('Before upgrading', async () => {
        const dbms = await env.dbmss.get(dbmsMinor.id);

        expect(dbms.version).toEqual(TEST_NEO4J_VERSIONS.minorUpgradeSource);
    });

    test('Upgrading to lower', async () => {
        // eslint-disable-next-line max-len
        const message = `Target version must be greater than ${dbmsMinor.version}.\n\nSuggested Action(s):\n- Use valid version`;

        const currentVersion = TEST_NEO4J_VERSIONS.minorUpgradeSource;
        const lowerVersion = `${major(currentVersion)}.${minor(currentVersion)}.${patch(currentVersion) - 1}`;

        await expect(env.dbmss.upgrade(dbmsMinor.id, lowerVersion)).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('Upgrading to same', async () => {
        // eslint-disable-next-line max-len
        const message = `Target version must be greater than ${dbmsMinor.version}.\n\nSuggested Action(s):\n- Use valid version`;

        await expect(env.dbmss.upgrade(dbmsMinor.id, dbmsMinor.version || '')).rejects.toThrow(
            new InvalidArgumentError(message),
        );
    });

    test('Upgrading running', async () => {
        await env.dbmss.start([dbmsMinor.id]);

        const message = 'Can only upgrade stopped dbms.\n\nSuggested Action(s):\n- Stop dbms';

        await expect(env.dbmss.upgrade(dbmsMinor.id, TEST_NEO4J_VERSIONS.minorUpgradeTarget)).rejects.toThrow(
            new InvalidArgumentError(message),
        );
        await env.dbmss.stop([dbmsMinor.id]);
    });

    test('Upgrading minor', async () => {
        const upgraded = await env.dbmss.upgrade(dbmsMinor.id, TEST_NEO4J_VERSIONS.minorUpgradeTarget, {
            migrate: false,
            backup: false,
            noCache: false,
        });

        expect(upgraded.version).toEqual(TEST_NEO4J_VERSIONS.minorUpgradeTarget);
        expect(upgraded.id).toEqual(dbmsMinor.id);
    });

    test('Preserves config when upgrading minor', async () => {
        dbmsMinor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.minorUpgradeSource);
        const config = await env.dbmss.getDbmsConfig(dbmsMinor.id);

        config.set('foo', 'bar');
        await config.flush();

        const upgraded = await env.dbmss.upgrade(dbmsMinor.id, TEST_NEO4J_VERSIONS.minorUpgradeTarget, {
            migrate: true,
            backup: false,
            noCache: false,
        });
        const upgradedConfig = await env.dbmss.getDbmsConfig(dbmsMinor.id);

        expect(upgraded.version).toEqual(TEST_NEO4J_VERSIONS.minorUpgradeTarget);
        expect(upgraded.id).toEqual(dbmsMinor.id);
        expect(upgradedConfig.get('foo')).toEqual('bar');
    });

    test('Upgrading major', async () => {
        const upgraded = await env.dbmss.upgrade(dbmsMajor.id, TEST_NEO4J_VERSIONS.majorUpgradeTarget, {
            migrate: false,
            backup: false,
            noCache: false,
        });

        expect(upgraded.version).toEqual(TEST_NEO4J_VERSIONS.majorUpgradeTarget);
        expect(upgraded.id).toEqual(dbmsMajor.id);
    });

    test('Preserves config when upgrading major', async () => {
        dbmsMajor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.majorUpgradeSource);
        const config = await env.dbmss.getDbmsConfig(dbmsMajor.id);

        config.set('foo', 'bar');
        await config.flush();

        const upgraded = await env.dbmss.upgrade(dbmsMajor.id, TEST_NEO4J_VERSIONS.majorUpgradeTarget, {
            migrate: false,
            backup: false,
            noCache: false,
        });
        const upgradedConfig = await env.dbmss.getDbmsConfig(dbmsMajor.id);

        expect(upgraded.version).toEqual(TEST_NEO4J_VERSIONS.majorUpgradeTarget);
        expect(upgraded.id).toEqual(dbmsMajor.id);
        expect(upgradedConfig.get('foo')).toEqual('bar');
    });

    test('Upgrades all plugins when upgrading', async () => {
        dbmsMinor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.minorUpgradeSource);

        await env.dbmsPlugins.install([dbmsMinor.id], 'streams');
        await env.dbmsPlugins.addSources([
            {
                name: 'custom-plugin',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
                versionsUrl: 'https://neo4j-contrib.github.io/neo4j-apoc-procedures/versions.json',
            },
        ]);
        await env.dbmsPlugins.install([dbmsMinor.id], 'custom-plugin');
        // Removing the source effectively emulates a plugin that was installed
        // manually by just copying the jar file.
        await env.dbmsPlugins.removeSources(['custom-plugin']);

        const installedPlugins = await env.dbmsPlugins.list(dbmsMinor.id);
        const mappedInstalledPlugins = installedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        const dbmsUpgraded = await env.dbmss.upgrade(dbmsMinor.id, TEST_NEO4J_VERSIONS.minorUpgradeTarget, {
            migrate: false,
            backup: false,
            noCache: false,
            pluginUpgradeMode: PLUGIN_UPGRADE_MODE.ALL,
        });
        const upgradedPlugins = await env.dbmsPlugins.list(dbmsMinor.id);
        const mappedUpgradedPlugins = upgradedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        expect(dbmsUpgraded.version).toEqual(TEST_NEO4J_VERSIONS.minorUpgradeTarget);
        expect(dbmsUpgraded.id).toEqual(dbmsMinor.id);
        expect(mappedInstalledPlugins).toEqual([
            {
                name: 'custom-plugin',
                version: TEST_APOC_VERSIONS.lower,
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.2.0',
            },
            {
                name: 'streams',
                version: '4.1.1',
            },
        ]);
        expect(mappedUpgradedPlugins).toEqual([
            {
                // There's no source for this plugin, so it's copied as is
                // instead of being upgraded.
                name: 'custom-plugin',
                version: TEST_APOC_VERSIONS.lower,
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.2.0',
            },
            {
                name: 'streams',
                version: '4.1.2',
            },
        ]);
    });

    test('Upgrades no plugins when upgrading', async () => {
        dbmsMinor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.minorUpgradeSource);
        await env.dbmsPlugins.install([dbmsMinor.id], 'streams');

        await env.dbmsPlugins.addSources([
            {
                name: 'custom-plugin',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
                versionsUrl: 'https://neo4j-contrib.github.io/neo4j-apoc-procedures/versions.json',
            },
        ]);
        await env.dbmsPlugins.install([dbmsMinor.id], 'custom-plugin');
        // Removing the source effectively emulates a plugin that was installed
        // manually by just copying the jar file.
        await env.dbmsPlugins.removeSources(['custom-plugin']);

        const installedPlugins = await env.dbmsPlugins.list(dbmsMinor.id);
        const mappedInstalledPlugins = installedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        const dbmsUpgraded = await env.dbmss.upgrade(dbmsMinor.id, TEST_NEO4J_VERSIONS.minorUpgradeTarget, {
            migrate: false,
            backup: false,
            noCache: false,
            pluginUpgradeMode: PLUGIN_UPGRADE_MODE.NONE,
        });
        const upgradedPlugins = await env.dbmsPlugins.list(dbmsMinor.id);
        const mappedUpgradedPlugins = upgradedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        expect(dbmsUpgraded.version).toEqual(TEST_NEO4J_VERSIONS.minorUpgradeTarget);
        expect(dbmsUpgraded.id).toEqual(dbmsMinor.id);
        expect(mappedInstalledPlugins).toEqual([
            {
                name: 'custom-plugin',
                version: TEST_APOC_VERSIONS.lower,
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.2.0',
            },
            {
                name: 'streams',
                version: '4.1.1',
            },
        ]);
        expect(mappedUpgradedPlugins).toEqual([
            {
                // The JWT plugin is always installed in Relate DBMSs regardless
                // of plugin upgrade mode.
                name: 'neo4j-jwt-addon',
                version: '1.2.0',
            },
        ]);
    });

    test('Upgrades only upgradable plugins when upgrading', async () => {
        nock('https://example.com')
            .get('/custom-plugin/versions.json')
            .once()
            .reply(200, [
                {
                    version: TEST_APOC_VERSIONS.lower,
                    neo4jVersion: TEST_NEO4J_VERSIONS.minorUpgradeSource,
                    downloadUrl: `https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/${TEST_APOC_VERSIONS.lower}/apoc-${TEST_APOC_VERSIONS.lower}-all.jar`,
                    sha256: TEST_APOC_VERSIONS.lowerSha256,
                    config: {
                        '+:dbms.security.procedures.unrestricted': ['apoc.*'],
                    },
                },
            ]);

        dbmsMinor = await env.dbmss.install(app.createName(), TEST_NEO4J_VERSIONS.minorUpgradeSource);
        await env.dbmsPlugins.install([dbmsMinor.id], 'streams');

        await env.dbmsPlugins.addSources([
            {
                name: 'custom-plugin',
                homepageUrl: 'https://example.com/custom-plugin',
                versionsUrl: 'https://example.com/custom-plugin/versions.json',
            },
        ]);
        await env.dbmsPlugins.install([dbmsMinor.id], 'custom-plugin');
        // Removing the source effectively emulates a plugin that was installed
        // manually by just copying the jar file.
        await env.dbmsPlugins.removeSources(['custom-plugin']);

        const installedPlugins = await env.dbmsPlugins.list(dbmsMinor.id);
        const mappedInstalledPlugins = installedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        const dbmsUpgraded = await env.dbmss.upgrade(dbmsMinor.id, TEST_NEO4J_VERSIONS.minorUpgradeTarget, {
            migrate: false,
            backup: false,
            noCache: false,
            pluginUpgradeMode: PLUGIN_UPGRADE_MODE.UPGRADABLE,
        });
        const upgradedPlugins = await env.dbmsPlugins.list(dbmsMinor.id);
        const mappedUpgradedPlugins = upgradedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        expect(dbmsUpgraded.version).toEqual(TEST_NEO4J_VERSIONS.minorUpgradeTarget);
        expect(dbmsUpgraded.id).toEqual(dbmsMinor.id);
        expect(mappedInstalledPlugins).toEqual([
            {
                name: 'custom-plugin',
                version: TEST_APOC_VERSIONS.lower,
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.2.0',
            },
            {
                name: 'streams',
                version: '4.1.1',
            },
        ]);
        expect(mappedUpgradedPlugins).toEqual([
            {
                name: 'neo4j-jwt-addon',
                version: '1.2.0',
            },
            {
                name: 'streams',
                version: '4.1.2',
            },
        ]);
    });
});
