import nock from 'nock';

import {TargetExistsError} from '../../errors';
import {IDbmsPluginSource, IDbmsPluginVersion} from '../../models';
import {waitForDbmsToBeOnline} from '../../utils/dbmss';
import {dbQuery} from '../../utils/dbmss/system-db-query';
import {TestEnvironment, TEST_NEO4J_CREDENTIALS} from '../../utils/system';
import {NEO4J_PLUGIN_SOURCES_URL} from '../environments';

const PLUGIN_SOURCES_ORIGIN = new URL(NEO4J_PLUGIN_SOURCES_URL).origin;
const PLUGIN_SOURCES_PATHNAME = new URL(NEO4J_PLUGIN_SOURCES_URL).pathname;

const TEST_SOURCE: IDbmsPluginSource = {
    name: 'apoc',
    homepageUrl: 'http://apoc.test/homepageUrl',
    versionsUrl: 'http://apoc.test/versionsUrl',
};

const TEST_SOURCE_2: IDbmsPluginSource = {
    name: 'gds',
    homepageUrl: 'http://gds.test/homepageUrl',
    versionsUrl: 'http://gds.test/versionsUrl',
};

// @todo - delete this once the official version files are updated
const TEST_VERSIONS: IDbmsPluginVersion[] = [
    {
        version: '4.2.0.1',
        neo4jVersion: '4.2.2',
        homepageUrl: 'http://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/4.2.0.1',
        downloadUrl:
            'https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.2.0.1/apoc-4.2.0.1-all.jar',
        sha256: '75ec237dfac08723e04fcd012dfd656faa9db92e679fc1bbbbe8ddd3e8ea0d9a',
        config: {
            '+:dbms.security.procedures.unrestricted': ['apoc.*'],
        },
    },
    {
        version: '4.0.0.17',
        neo4jVersion: '4.0.4',
        homepageUrl: 'http://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/4.0.0.17',
        downloadUrl:
            'https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.0.0.17/apoc-4.0.0.17-all.jar',
        sha256: 'ed388e5e7bea1842f35dccfe2d2e03db3271c59b2b6fa52ae8cfcc50fbb5e2b6',
        config: {
            '+:dbms.security.procedures.unrestricted': ['apoc.*'],
        },
    },
];
const PLUGIN_VERSIONS_PATHNAME = new URL(TEST_SOURCE.versionsUrl).pathname;
const PLUGIN_VERSIONS_ORIGIN = new URL(TEST_SOURCE.versionsUrl).origin;

describe('LocalDbmsPlugins', () => {
    let app: TestEnvironment;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
    });

    afterEach(() => nock.cleanAll());

    afterAll(() => app.teardown());

    test('dbmsPlugins.listSources - no plugin sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .reply(200, {});

        const pluginSourcesNoDefaults = await app.environment.dbmsPlugins.listSources();
        expect(pluginSourcesNoDefaults.toArray()).toEqual([]);

        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .reply(500);

        const pluginSourcesFetchError = await app.environment.dbmsPlugins.listSources();
        expect(pluginSourcesFetchError.toArray()).toEqual([]);
    });

    test('dbmsPlugins.listSources - default plugin sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .reply(200, {
                apoc: TEST_SOURCE,
            });

        const pluginSources = await app.environment.dbmsPlugins.listSources();
        expect(pluginSources.toArray()).toEqual([
            {
                ...TEST_SOURCE,
                isOfficial: true,
            },
        ]);
    });

    test('dbmsPlugins.addSources - fails when adding an already existing source', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {
                apoc: TEST_SOURCE,
            });

        const addedSources = app.environment.dbmsPlugins.addSources([TEST_SOURCE]);
        await expect(addedSources).rejects.toThrowError(
            new TargetExistsError(`The following dbms plugin sources already exist: apoc`),
        );

        const listedSources = await app.environment.dbmsPlugins.listSources();
        expect(listedSources.toArray()).toEqual([
            {
                ...TEST_SOURCE,
                isOfficial: true,
            },
        ]);
    });

    test('dbmsPlugins.addSources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {});

        const addedSources = await app.environment.dbmsPlugins.addSources([TEST_SOURCE]);
        const listedSources = await app.environment.dbmsPlugins.listSources();

        const expectedSource = {
            ...TEST_SOURCE,
            isOfficial: false,
        };
        expect(addedSources.toArray()).toEqual([expectedSource]);
        expect(listedSources.toArray()).toEqual([expectedSource]);
    });

    test('dbmsPlugins.addSources - isOfficial attribute is ignored when adding sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {});

        const addedSources = await app.environment.dbmsPlugins.addSources([
            {
                ...TEST_SOURCE_2,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                isOfficial: true,
            },
        ]);
        const listedSources = await app.environment.dbmsPlugins.listSources();

        const expectedSources = [
            {
                ...TEST_SOURCE,
                isOfficial: false,
            },
            {
                ...TEST_SOURCE_2,
                isOfficial: false,
            },
        ];
        expect(addedSources.toArray()).toEqual([expectedSources[1]]);
        expect(listedSources.toArray()).toEqual(expectedSources);
    });

    test('dbmsPlugins.removeSources - removes user added sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {});

        const removedSources = await app.environment.dbmsPlugins.removeSources(['gds', 'apoc']);
        const listedSources = await app.environment.dbmsPlugins.listSources();

        expect(removedSources.toArray()).toEqual([
            {
                ...TEST_SOURCE,
                isOfficial: false,
            },
            {
                ...TEST_SOURCE_2,
                isOfficial: false,
            },
        ]);
        expect(listedSources.toArray()).toEqual([]);
    });

    test('dbmsPlugins.removeSources - cannot remove default sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {
                apoc: TEST_SOURCE,
            });

        const removedSources = await app.environment.dbmsPlugins.removeSources(['apoc']);
        const listedSources = await app.environment.dbmsPlugins.listSources();

        expect(removedSources.toArray()).toEqual([]);
        expect(listedSources.toArray()).toEqual([
            {
                ...TEST_SOURCE,
                isOfficial: true,
            },
        ]);
    });

    test('dbmsPlugins.install - installs apoc successfully', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {
                apoc: TEST_SOURCE,
            });

        nock(PLUGIN_VERSIONS_ORIGIN)
            .get(PLUGIN_VERSIONS_PATHNAME)
            .reply(200, JSON.stringify(TEST_VERSIONS));

        const dbms = await app.createDbms();
        const installedVersion = await app.environment.dbmsPlugins.install([dbms.id], 'apoc');

        expect(installedVersion.toArray().length).toEqual(1);
        expect(installedVersion.toArray()[0].version).toEqual('4.0.0.17');

        await app.environment.dbmss.start([dbms.id]);
        await waitForDbmsToBeOnline({
            ...dbms,
            config: await app.environment.dbmss.getDbmsConfig(dbms.id),
        });

        const accessToken = await app.environment.dbmss.createAccessToken('tests', dbms.id, {
            credentials: TEST_NEO4J_CREDENTIALS,
            principal: 'neo4j',
            scheme: 'basic',
        });

        const [res] = await dbQuery(
            {
                database: 'neo4j',
                dbmsUser: 'neo4j',
                accessToken,
                dbmsId: dbms.id,
                environment: app.environment,
            },
            'RETURN apoc.version()',
        ).finally(() => app.environment.dbmss.stop([dbms.id]));

        expect(res.data).toEqual(['4.0.0.17']);
        expect(res.type).toEqual('RECORD');
    });
});
