import nock from 'nock';
import {TargetExistsError} from '../../errors';
import {IDbmsPluginSource} from '../../models';
import {TestEnvironment} from '../../utils/system';
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
            .reply(200, {
                apoc: TEST_SOURCE,
            });

        const addedSources = app.environment.dbmsPlugins.addSources([TEST_SOURCE]);
        await expect(addedSources).rejects.toThrowError(
            new TargetExistsError(`The following dbms plugin sources already exist: apoc`),
        );

        const listedSources = await app.environment.dbmsPlugins.listSources();
        expect(listedSources.toArray()).toEqual([]);
    });

    test('dbmsPlugins.addSources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
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
});
