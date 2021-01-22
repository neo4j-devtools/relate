import nock from 'nock';
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

describe('LocalPlugins', () => {
    let app: TestEnvironment;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
    });

    afterEach(() => nock.cleanAll());

    afterAll(() => app.teardown());

    test('Lists no plugin sources', async () => {
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

    test('Lists default plugin sources', async () => {
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

    test('Add plugin sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .reply(200, {});

        const addedSources = await app.environment.dbmsPlugins.addSources([TEST_SOURCE]);
        const listedSources = await app.environment.dbmsPlugins.listSources();

        expect(addedSources.toArray()).toEqual([TEST_SOURCE]);
        expect(listedSources.toArray()).toEqual([TEST_SOURCE]);
    });

    test('Remove user added plugin sources', async () => {
        nock(PLUGIN_SOURCES_ORIGIN)
            .get(PLUGIN_SOURCES_PATHNAME)
            .twice()
            .reply(200, {});

        const removedSources = await app.environment.dbmsPlugins.removeSources(['apoc']);
        const listedSources = await app.environment.dbmsPlugins.listSources();

        expect(removedSources.toArray()).toEqual([TEST_SOURCE]);
        expect(listedSources.toArray()).toEqual([]);
    });

    test('Cannot remove official plugin sources', async () => {
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
