import {test} from '@oclif/test';

import InstallCommand from '../../commands/dbms/install';
import UninstallCommand from '../../commands/dbms/uninstall';

// seriously windows... (ノಠ益ಠ)ノ彡 sǝldᴉɔuᴉɹd
jest.setTimeout(60000);

jest.mock('fs-extra', () => {
    return {
        writeFile: (_path: string, data: string) => Promise.resolve(data),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ACCOUNT_ID = 'test';
const TEST_DB_NAME = 'test-db';
const TEST_DB_CREDENTIALS = 'newpassword';
const TEST_DB_VERSION = '4.0.4';

describe('$relate dbms', () => {
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

    afterAll(() => UninstallCommand.run([TEST_DB_NAME, '--account', TEST_ACCOUNT_ID]));

    test.stdout()
        .command(['dbms:start', TEST_DB_NAME, '--account', TEST_ACCOUNT_ID])
        .it('logs start message', (ctx) => {
            if (process.platform === 'win32') {
                expect(ctx.stdout).toContain('Neo4j service started');
            } else {
                expect(ctx.stdout).toContain('Directories in use');
                expect(ctx.stdout).toContain('Starting Neo4j');
                expect(ctx.stdout).toContain('Started neo4j (pid');
            }
        });

    test.stdout()
        .command(['dbms:list', '--account', TEST_ACCOUNT_ID])
        .it('lists DBMSs', (ctx) => {
            expect(ctx.stdout).toContain(TEST_DB_NAME);
        });

    test.stdout()
        .command(['dbms:status', TEST_DB_NAME, '--account', TEST_ACCOUNT_ID])
        .it('logs running status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is running');
        });

    test.stdout()
        .skip()
        // arbitrary wait for Neo4j to come online
        .do(() => new Promise((resolve) => setTimeout(resolve, 25000)))
        .command([
            'dbms:access-token',
            TEST_DB_NAME,
            '--principal=neo4j',
            '--credentials=newpassword',
            '--account',
            TEST_ACCOUNT_ID,
        ])
        .it('logs access token', (ctx) => {
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });

    test.stdout()
        .stderr()
        .command(['dbms:stop', TEST_DB_NAME, '--account', TEST_ACCOUNT_ID])
        .it('logs stop message', (ctx) => {
            expect(ctx.stdout).toBe('');
            expect(ctx.stderr).toContain('done');
        });

    test.stdout()
        .command(['dbms:status', TEST_DB_NAME, '--account', TEST_ACCOUNT_ID])
        .it('logs stopped status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is not running');
        });

    test.stdout()
        .command(['dbms:status', 'non-existent', '--account', TEST_ACCOUNT_ID])
        .catch((ctx) => {
            expect(ctx.message).toContain('DBMS "non-existent" not found');
        })
        .it('errors when trying to access a non existing dbms');
});
