import {test} from '@oclif/test';
import {TestDbmss} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import ListCommand from '../../commands/dbms/list';
import StartCommand from '../../commands/dbms/start';
import InfoCommand from '../../commands/dbms/info';
import StopCommand from '../../commands/dbms/stop';

jest.mock('fs-extra', () => {
    return {
        writeFile: (_path: string, data: string): Promise<string> => Promise.resolve(data),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ENVIRONMENT_ID = 'test';
let TEST_DB_NAME: string;

describe('$relate dbms', () => {
    const dbmss = new TestDbmss(__filename);

    beforeAll(async () => {
        const {name} = await dbmss.createDbms();

        TEST_DB_NAME = name;
    });

    afterAll(() => dbmss.teardown());

    test.stdout().it('logs start message', async (ctx) => {
        await StartCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
        if (process.platform === 'win32') {
            expect(ctx.stdout).toContain('Neo4j service started');
        } else {
            expect(ctx.stdout).toContain('Directories in use');
            expect(ctx.stdout).toContain('Starting Neo4j');
            expect(ctx.stdout).toContain('Started neo4j (pid');
        }
    });

    test.stdout().it('lists DBMSs', async (ctx) => {
        await ListCommand.run(['--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain(TEST_DB_NAME);
    });

    test.stdout().it('logs running status', async (ctx) => {
        await InfoCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain('Neo4j is running');
    });

    test.skip()
        .stdout()
        // arbitrary wait for Neo4j to come online
        .do(() => new Promise((resolve) => setTimeout(resolve, 25000)))
        .stdin(TestDbmss.DBMS_CREDENTIALS)
        .it('logs access token', async (ctx) => {
            await AccessTokenCommand.run([TEST_DB_NAME, '--principal=neo4j', '--environment', TEST_ENVIRONMENT_ID]);
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });

    test.stdout()
        .stderr()
        .it('logs stop message', async (ctx) => {
            await StopCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
            expect(ctx.stdout).toBe('');
            expect(ctx.stderr).toContain('done');
        });

    test.stdout().it('logs stopped status', async (ctx) => {
        await InfoCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain('Neo4j is not running');
    });

    test.it('errors when trying to access a non existing dbms', async () => {
        const command = InfoCommand.run(['non-existent', '--environment', TEST_ENVIRONMENT_ID]);
        const expectedError = new Error('DBMS "non-existent" not found');
        await expect(command).rejects.toThrow(expectedError);
    });
});
