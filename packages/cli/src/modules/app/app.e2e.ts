import {test} from '@oclif/test';
import InstallCommand from '../../commands/dbms/install';
import UninstallCommand from '../../commands/dbms/uninstall';
import StopCommand from '../../commands/dbms/stop';

jest.mock('cli-ux', () => {
    return {
        open: () => Promise.resolve(),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ACCOUNT_ID = 'test';
const TEST_APP_ID = 'foo';
const TEST_DB_NAME = 'app.e2e.ts';
const TEST_DB_CREDENTIALS = 'newpassword';
const TEST_DB_VERSION = process.env.TEST_NEO4J_VERSION || '';

describe('$relate app', () => {
    beforeAll(() =>
        InstallCommand.run([
            TEST_DB_NAME,
            '--credentials',
            TEST_DB_CREDENTIALS,
            '--version',
            TEST_DB_VERSION,
            '--account',
            TEST_ACCOUNT_ID,
        ]),
    );

    afterAll(async () => {
        await StopCommand.run([TEST_DB_NAME, '--account', TEST_ACCOUNT_ID]);
        await UninstallCommand.run([TEST_DB_NAME, '--account', TEST_ACCOUNT_ID]);
    });

    test.stdout()
        .command(['dbms:start', TEST_DB_NAME, `--account=${TEST_ACCOUNT_ID}`])
        // arbitrary wait for Neo4j to come online
        .do(() => new Promise((resolve) => setTimeout(resolve, 25000)))
        .command([
            'dbms:access-token',
            TEST_DB_NAME,
            '--principal=neo4j',
            `--credentials=${TEST_DB_CREDENTIALS}`,
            `--account=${TEST_ACCOUNT_ID}`,
        ])
        .command([
            'app:launch',
            TEST_APP_ID,
            `--dbmsId=${TEST_DB_NAME}`,
            '--principal=neo4j',
            `--account=${TEST_ACCOUNT_ID}`,
        ])
        .it('logs app launch token', (ctx) => {
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });
});
