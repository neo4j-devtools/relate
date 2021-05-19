import {InvalidArgumentError} from '../../errors';
import {TestDbmss} from '../../utils/system';
import {IDbmsInfo, PLUGIN_UPGRADE_MODE} from '../../models';
import {EnvironmentAbstract} from '../environments';
import nock from 'nock';

jest.setTimeout(240000);

describe('LocalDbmss - upgrade', () => {
    let testDbmss: TestDbmss;
    let env: EnvironmentAbstract;
    let dbms404: IDbmsInfo;
    let dbms35: IDbmsInfo;
    let dbms352: IDbmsInfo;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        env = testDbmss.environment;
        dbms404 = await env.dbmss.install(testDbmss.createName(), '4.0.4');
        dbms35 = await env.dbmss.install(testDbmss.createName(), '3.5.19');
        dbms352 = await env.dbmss.install(testDbmss.createName(), '3.5.19');
    });

    afterAll(async () => {
        await testDbmss.teardown();
    });

    test('Before upgrading', async () => {
        const dbms = await env.dbmss.get(dbms404.id);

        expect(dbms.version).toEqual('4.0.4');
    });

    test('Upgrading to lower', async () => {
        const message = 'Target version must be greater than 4.0.4.\n\nSuggested Action(s):\n- Use valid version';

        await expect(env.dbmss.upgrade(dbms404.id, '4.0.3')).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('Upgrading to same', async () => {
        const message = 'Target version must be greater than 4.0.4.\n\nSuggested Action(s):\n- Use valid version';

        await expect(env.dbmss.upgrade(dbms404.id, '4.0.4')).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('Upgrading running', async () => {
        await env.dbmss.start([dbms404.id]);

        const message = 'Can only upgrade stopped dbms.\n\nSuggested Action(s):\n- Stop dbms';

        await expect(env.dbmss.upgrade(dbms404.id, '4.0.5')).rejects.toThrow(new InvalidArgumentError(message));
        await env.dbmss.stop([dbms404.id]);
    });

    test('Upgrading to higher', async () => {
        const upgraded = await env.dbmss.upgrade(dbms404.id, '4.0.5', {
            migrate: true,
            backup: false,
            noCache: false,
        });

        expect(upgraded.version).toEqual('4.0.5');
        expect(upgraded.id).toEqual(dbms404.id);
    });

    test('Preserves config when upgrading to higher', async () => {
        const config = await env.dbmss.getDbmsConfig(dbms404.id);

        config.set('foo', 'bar');
        await config.flush();

        const upgraded = await env.dbmss.upgrade(dbms404.id, '4.0.6', {
            migrate: true,
            backup: false,
            noCache: false,
        });
        const upgradedConfig = await env.dbmss.getDbmsConfig(dbms404.id);

        expect(upgraded.version).toEqual('4.0.6');
        expect(upgraded.id).toEqual(dbms404.id);
        expect(upgradedConfig.get('foo')).toEqual('bar');
    });

    test('Upgrading major', async () => {
        const upgraded = await env.dbmss.upgrade(dbms35.id, '4.1.0', {
            migrate: false,
            backup: false,
            noCache: false,
        });

        expect(upgraded.version).toEqual('4.1.0');
        expect(upgraded.id).toEqual(dbms35.id);
    });

    test('Preserves config when upgrading major', async () => {
        const config = await env.dbmss.getDbmsConfig(dbms352.id);

        config.set('foo', 'bar');
        await config.flush();

        const upgraded = await env.dbmss.upgrade(dbms352.id, '4.1.0', {
            migrate: false,
            backup: false,
            noCache: false,
        });
        const upgradedConfig = await env.dbmss.getDbmsConfig(dbms352.id);

        expect(upgraded.version).toEqual('4.1.0');
        expect(upgraded.id).toEqual(dbms352.id);
        expect(upgradedConfig.get('foo')).toEqual('bar');
    });

    test('Upgrades all plugins when upgrading', async () => {
        dbms404 = await env.dbmss.install(testDbmss.createName(), '4.0.4');

        await env.dbmsPlugins.install([dbms404.id], 'streams');
        await env.dbmsPlugins.addSources([
            {
                name: 'custom-plugin',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
                versionsUrl: 'https://neo4j-contrib.github.io/neo4j-apoc-procedures/versions.json',
            },
        ]);
        await env.dbmsPlugins.install([dbms404.id], 'custom-plugin');
        // Removing the source effectively emulates a plugin that was installed
        // manually by just copying the jar file.
        await env.dbmsPlugins.removeSources(['custom-plugin']);

        const installedPlugins = await env.dbmsPlugins.list(dbms404.id);
        const mappedInstalledPlugins = installedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        const dbmsUpgraded = await env.dbmss.upgrade(dbms404.id, '4.1.0', {
            migrate: false,
            backup: false,
            noCache: false,
            pluginUpgradeMode: PLUGIN_UPGRADE_MODE.ALL,
        });
        const upgradedPlugins = await env.dbmsPlugins.list(dbms404.id);
        const mappedUpgradedPlugins = upgradedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        expect(dbmsUpgraded.version).toEqual('4.1.0');
        expect(dbmsUpgraded.id).toEqual(dbms404.id);
        expect(mappedInstalledPlugins).toEqual([
            {
                name: 'custom-plugin',
                version: '4.0.0.17',
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.0.2',
            },
            {
                name: 'streams',
                version: '4.0.3',
            },
        ]);
        expect(mappedUpgradedPlugins).toEqual([
            {
                // There's no source for this plugin, so it's copied as is
                // instead of being upgraded.
                name: 'custom-plugin',
                version: '4.0.0.17',
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.1.0',
            },
            {
                name: 'streams',
                version: '4.0.6',
            },
        ]);
    });

    test('Upgrades no plugins when upgrading', async () => {
        dbms404 = await env.dbmss.install(testDbmss.createName(), '4.0.4');
        await env.dbmsPlugins.install([dbms404.id], 'streams');

        await env.dbmsPlugins.addSources([
            {
                name: 'custom-plugin',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
                versionsUrl: 'https://neo4j-contrib.github.io/neo4j-apoc-procedures/versions.json',
            },
        ]);
        await env.dbmsPlugins.install([dbms404.id], 'custom-plugin');
        // Removing the source effectively emulates a plugin that was installed
        // manually by just copying the jar file.
        await env.dbmsPlugins.removeSources(['custom-plugin']);

        const installedPlugins = await env.dbmsPlugins.list(dbms404.id);
        const mappedInstalledPlugins = installedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        const dbmsUpgraded = await env.dbmss.upgrade(dbms404.id, '4.1.0', {
            migrate: false,
            backup: false,
            noCache: false,
            pluginUpgradeMode: PLUGIN_UPGRADE_MODE.NONE,
        });
        const upgradedPlugins = await env.dbmsPlugins.list(dbms404.id);
        const mappedUpgradedPlugins = upgradedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        expect(dbmsUpgraded.version).toEqual('4.1.0');
        expect(dbmsUpgraded.id).toEqual(dbms404.id);
        expect(mappedInstalledPlugins).toEqual([
            {
                name: 'custom-plugin',
                version: '4.0.0.17',
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.0.2',
            },
            {
                name: 'streams',
                version: '4.0.3',
            },
        ]);
        expect(mappedUpgradedPlugins).toEqual([
            {
                // The JWT plugin is always installed in Relate DBMSs regardless
                // of plugin upgrade mode.
                name: 'neo4j-jwt-addon',
                version: '1.1.0',
            },
        ]);
    });

    test('Upgrades only upgradable plugins when upgrading', async () => {
        nock('https://example.com')
            .get('/custom-plugin/versions.json')
            .once()
            .reply(200, [
                {
                    version: '4.0.0.17',
                    neo4jVersion: '4.0.4',
                    downloadUrl:
                        'https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.17/apoc-4.0.0.17-all.jar',
                    sha256: 'ed388e5e7bea1842f35dccfe2d2e03db3271c59b2b6fa52ae8cfcc50fbb5e2b6',
                    config: {
                        '+:dbms.security.procedures.unrestricted': ['apoc.*'],
                    },
                },
            ]);

        dbms404 = await env.dbmss.install(testDbmss.createName(), '4.0.4');
        await env.dbmsPlugins.install([dbms404.id], 'streams');

        await env.dbmsPlugins.addSources([
            {
                name: 'custom-plugin',
                homepageUrl: 'https://example.com/custom-plugin',
                versionsUrl: 'https://example.com/custom-plugin/versions.json',
            },
        ]);
        await env.dbmsPlugins.install([dbms404.id], 'custom-plugin');
        // Removing the source effectively emulates a plugin that was installed
        // manually by just copying the jar file.
        await env.dbmsPlugins.removeSources(['custom-plugin']);

        const installedPlugins = await env.dbmsPlugins.list(dbms404.id);
        const mappedInstalledPlugins = installedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        const dbmsUpgraded = await env.dbmss.upgrade(dbms404.id, '4.1.0', {
            migrate: false,
            backup: false,
            noCache: false,
            pluginUpgradeMode: PLUGIN_UPGRADE_MODE.UPGRADABLE,
        });
        const upgradedPlugins = await env.dbmsPlugins.list(dbms404.id);
        const mappedUpgradedPlugins = upgradedPlugins.toArray().map((plugin) => ({
            name: plugin.name,
            version: plugin.version.version,
        }));

        expect(dbmsUpgraded.version).toEqual('4.1.0');
        expect(dbmsUpgraded.id).toEqual(dbms404.id);
        expect(mappedInstalledPlugins).toEqual([
            {
                name: 'custom-plugin',
                version: '4.0.0.17',
            },
            {
                name: 'neo4j-jwt-addon',
                version: '1.0.2',
            },
            {
                name: 'streams',
                version: '4.0.3',
            },
        ]);
        expect(mappedUpgradedPlugins).toEqual([
            {
                name: 'neo4j-jwt-addon',
                version: '1.1.0',
            },
            {
                name: 'streams',
                version: '4.0.6',
            },
        ]);
    });
});
