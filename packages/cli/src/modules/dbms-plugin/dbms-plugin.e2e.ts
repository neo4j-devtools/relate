import path from 'path';
import {test} from '@oclif/test';
import {TestEnvironment, IDbmsInfo, envPaths} from '@relate/common';

import ListSourcesCommand from '../../commands/dbms-plugin/list-sources';
import AddSourcesCommand from '../../commands/dbms-plugin/add-sources';
import InstallCommand from '../../commands/dbms-plugin/install';

const FIXTURES_PATH = path.resolve(envPaths().data, '..');

describe('$relate dbms', () => {
    let app: TestEnvironment;
    let TEST_ENVIRONMENT_ID: string;
    let dbms: IDbmsInfo;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
        dbms = await app.createDbms();

        TEST_ENVIRONMENT_ID = app.environment.id;
    });

    afterAll(() => app.teardown());

    test.stdout().it('lists no unofficial sources', async (ctx) => {
        await ListSourcesCommand.run([
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--output=json',
            '--filter=official=false',
        ]);

        expect(JSON.parse(ctx.stdout)).toEqual([]);
    });

    test.stdout().it('adds unofficial sources', async (ctx) => {
        await AddSourcesCommand.run([
            '--environment',
            TEST_ENVIRONMENT_ID,
            path.join(FIXTURES_PATH, 'test-plugin-source.json'),
            '--output=json',
        ]);

        expect(JSON.parse(ctx.stdout)).toEqual([
            {
                name: 'plugin-test',
                isOfficial: 'false',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
            },
        ]);
    });

    test.stdout().it('lists added source', async (ctx) => {
        await ListSourcesCommand.run([
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--output=json',
            '--filter=official=false',
        ]);

        expect(JSON.parse(ctx.stdout)).toEqual([
            {
                name: 'plugin-test',
                isOfficial: 'false',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
            },
        ]);
    });

    test.stdout().it('installs plugin', async (ctx) => {
        await InstallCommand.run([
            '--environment',
            TEST_ENVIRONMENT_ID,
            dbms.name,
            '--plugin=plugin-test',
            '--output=json',
        ]);

        expect(JSON.parse(ctx.stdout)).toEqual([
            {
                name: 'plugin-test',
                isOfficial: 'false',
                homepageUrl: 'https://github.com/neo4j-contrib/neo4j-apoc-procedures',
                version: '4.0.0.17',
            },
        ]);
    });
});
