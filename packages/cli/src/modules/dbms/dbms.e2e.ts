import path from 'path';
import {test} from '@oclif/test';
import {TestDbmss, DBMS_STATUS, envPaths} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import ListCommand from '../../commands/dbms/list';
import StartCommand from '../../commands/dbms/start';
import InfoCommand from '../../commands/dbms/info';
import StopCommand from '../../commands/dbms/stop';
import DumpCommand from '../../commands/db/dump';
import LoadCommand from '../../commands/db/load';
import ExecCommand from '../../commands/db/exec';

jest.mock('../../prompts', () => {
    return {
        passwordPrompt: (): Promise<string> => Promise.resolve(TestDbmss.DBMS_CREDENTIALS),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
let TEST_ENVIRONMENT_ID: string;
let TEST_DB_NAME: string;
let TEST_DB_ID: string;

describe('$relate dbms', () => {
    let dbmss: TestDbmss;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {id, name} = await dbmss.createDbms();

        TEST_ENVIRONMENT_ID = dbmss.environment.id;
        TEST_DB_NAME = name;
        TEST_DB_ID = id;
    });

    afterAll(() => dbmss.teardown());

    test.stdout().it('should log failed dump', async (ctx) => {
        await DumpCommand.run([TEST_DB_ID, '--environment', TEST_ENVIRONMENT_ID]);
        await expect(ctx.stdout).toContain('Failed to dump data.');
    });

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
        await ListCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--no-truncate']);
        expect(ctx.stdout).toContain(TEST_DB_NAME);
    });

    test.stdout().it('logs running status', async (ctx) => {
        await InfoCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain(DBMS_STATUS.STARTED);
    });

    test.stdout()
        .stdin(TestDbmss.DBMS_CREDENTIALS)
        .it('logs access token', async (ctx) => {
            await AccessTokenCommand.run([TEST_DB_NAME, '--user=neo4j', '--environment', TEST_ENVIRONMENT_ID]);
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });

    test.stdout().it('should import cypher', async (ctx) => {
        await ExecCommand.run([
            TEST_DB_ID,
            `--from=${process.env.NEO4J_RELATE_CONFIG_HOME}/movies.cypher`,
            '--database=neo4j',
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        await expect(ctx.stdout).toContain('Successfully imported');
    });

    test.stdout()
        .stderr()
        .it('logs stop message', async (ctx) => {
            await StopCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
            expect(ctx.stdout).toBe('');
            expect(ctx.stderr).toContain('done');
        });

    test.stdout().it('should log successful dump', async (ctx) => {
        await DumpCommand.run([
            TEST_DB_ID,
            `--to=${path.join(envPaths().data, 'test-db.dump')}`,
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        await expect(ctx.stdout).toContain('Successfully dumped');
    });

    test.stdout().it('should log successful load', async (ctx) => {
        await LoadCommand.run([
            TEST_DB_ID,
            `--from=${path.join(envPaths().data, 'test-db.dump')}`,
            '--database=neo4j',
            '--force',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        await expect(ctx.stdout).toContain('Successfully loaded data from');
    });

    test.stdout().it('logs stopped status', async (ctx) => {
        await InfoCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain(DBMS_STATUS.STOPPED);
    });

    test.it('errors when trying to access a non existing dbms', async () => {
        const command = InfoCommand.run(['non-existent', '--environment', TEST_ENVIRONMENT_ID]);
        const expectedError = new Error('DBMS "non-existent" not found');
        await expect(command).rejects.toThrow(expectedError);
    });
});
