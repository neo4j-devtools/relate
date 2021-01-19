import nock from 'nock';
import {IDbmsPluginSource} from '../../models';
import {TestEnvironment} from '../../utils/system';

describe('LocalPlugins', () => {
    let app: TestEnvironment;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
    });

    afterAll(() => app.teardown());

    test('Lists no plugin sources', async () => {
        const pluginSources = await app.environment.plugins.listSources();

        expect(pluginSources.toArray()).toEqual([]);
    });

    test('Add plugin sources by URL', async () => {
        const testSource: IDbmsPluginSource = {
            name: 'apoc',
            homepageUrl: 'http://apoc.test/homepageUrl',
            versionsUrl: 'http://apoc.test/versionsUrl',
        };
        nock('http://apoc.test')
            .get('/plugin-sources')
            .reply(200, testSource);

        const addedSources = await app.environment.plugins.addSources(['http://apoc.test/plugin-sources']);
        const listedSources = await app.environment.plugins.listSources();

        expect(addedSources.toArray()).toEqual([testSource]);
        expect(listedSources.toArray()).toEqual([testSource]);
    });

    test('Remove plugin sources', async () => {
        const testSource: IDbmsPluginSource = {
            name: 'apoc',
            homepageUrl: 'http://apoc.test/homepageUrl',
            versionsUrl: 'http://apoc.test/versionsUrl',
        };

        const removedSources = await app.environment.plugins.removeSources(['apoc']);
        const listedSources = await app.environment.plugins.listSources();

        expect(removedSources.toArray()).toEqual([testSource]);
        expect(listedSources.toArray()).toEqual([]);
    });
});
