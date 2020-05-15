import {test} from '@oclif/test';
import {TestDbmss} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import OpenCommand from '../../commands/app/open';
import StartCommand from '../../commands/dbms/start';
import InstallCommand from '../../commands/extension/install';
import UninstallCommand from '../../commands/extension/uninstall';

jest.mock('cli-ux', () => {
    return {
        open: () => Promise.resolve(),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ENVIRONMENT_ID = 'test';
const TEST_APP_NAME = 'neo4j-insight';
const TEST_APP_VERSION = '1.0.0';
let TEST_DB_NAME: string;

describe('$relate app', () => {
    const dbmss = new TestDbmss(__filename);

    beforeAll(async () => {
        const {name} = await dbmss.createDbms();

        await InstallCommand.run([TEST_APP_NAME, '-V', TEST_APP_VERSION]);

        TEST_DB_NAME = name;
    });

    afterAll(async () => {
        await UninstallCommand.run([TEST_APP_NAME]);

        return dbmss.teardown();
    });

    test.skip()
        .stdout()
        .it('logs app launch token', async (ctx) => {
            await StartCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);

            // arbitrary wait for Neo4j to come online
            await new Promise((resolve) => setTimeout(resolve, 25000));

            await AccessTokenCommand.run([
                TEST_DB_NAME,
                '--principal=neo4j',
                `--credentials=${TestDbmss.DBMS_CREDENTIALS}`,
                `--environment=${TEST_ENVIRONMENT_ID}`,
            ]);

            await OpenCommand.run([
                TEST_APP_NAME,
                `--dbmsId=${TEST_DB_NAME}`,
                '--principal=neo4j',
                `--environment=${TEST_ENVIRONMENT_ID}`,
                '-L',
            ]);

            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });
});
