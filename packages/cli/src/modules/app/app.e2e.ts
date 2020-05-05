import {test} from '@oclif/test';
import {TestDbmss} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import LaunchCommand from '../../commands/app/launch';
import StartCommand from '../../commands/dbms/start';

jest.mock('cli-ux', () => {
    return {
        open: () => Promise.resolve(),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ACCOUNT_ID = 'test';
const TEST_APP_ID = 'foo';
let TEST_DB_NAME: string;

describe('$relate app', () => {
    const dbmss = new TestDbmss(__filename);

    beforeAll(async () => {
        const {name} = await dbmss.createDbms();

        TEST_DB_NAME = name;
    });

    afterAll(() => dbmss.teardown());

    test.stdout()
        .skip()
        .it('logs app launch token', async (ctx) => {
            await StartCommand.run([TEST_DB_NAME, '--account', TEST_ACCOUNT_ID]);

            // arbitrary wait for Neo4j to come online
            await new Promise((resolve) => setTimeout(resolve, 25000));

            await AccessTokenCommand.run([
                TEST_DB_NAME,
                '--principal=neo4j',
                `--credentials=${TestDbmss.DBMS_CREDENTIALS}`,
                `--account=${TEST_ACCOUNT_ID}`,
            ]);

            await LaunchCommand.run([
                TEST_APP_ID,
                `--dbmsId=${TEST_DB_NAME}`,
                '--principal=neo4j',
                `--account=${TEST_ACCOUNT_ID}`,
            ]);

            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });
});
