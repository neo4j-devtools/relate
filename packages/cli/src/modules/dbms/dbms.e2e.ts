import path from 'path';
import {test} from '@oclif/test';
import {
    TestDbmss,
    DBMS_STATUS,
    envPaths,
    NotFoundError,
    IProject,
    IDbmsInfo,
    waitForDbmsToBeOnline,
} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import ListCommand from '../../commands/dbms/list';
import StartCommand from '../../commands/dbms/start';
import InfoCommand from '../../commands/dbms/info';
import StopCommand from '../../commands/dbms/stop';
import DumpCommand from '../../commands/db/dump';
import LoadCommand from '../../commands/db/load';
import ExecCommand from '../../commands/db/exec';
import {EnvironmentAbstract} from '@relate/common/dist/entities/environments';

jest.mock('../../prompts', () => {
    return {
        passwordPrompt: (): Promise<string> => Promise.resolve(TestDbmss.DBMS_CREDENTIALS),
    };
});

const skipTestOnWindows = process.platform === 'win32' ? test.skip() : test;
const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
let TEST_ENVIRONMENT_ID: string;

async function createTestProject(env: EnvironmentAbstract) {
    const projectName = 'Test Project';
    const testProject = await env.projects.create({
        name: projectName,
        dbmss: [],
    });
    env.projects.writeFile(projectName, 'blank.cypher', '');
    env.projects.writeFile(projectName, 'return-true.cypher', 'RETURN true;');
    env.projects.writeFile(projectName, 'return-without-semicolon.cypher', 'RETURN 42');
    env.projects.writeFile(projectName, 'bad-syntax.cypher', 'RERUN never works');
    env.projects.writeFile(projectName, 'missing-param.cypher', 'MATCH (n) WHERE n.name = $name RETURN n');
    return testProject;
}

describe('$relate dbms', () => {
    let dbmss: TestDbmss;
    let testDbms: IDbmsInfo;
    let testProject: IProject;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        testDbms = await dbmss.createDbms();

        TEST_ENVIRONMENT_ID = dbmss.environment.id;

        testProject = await createTestProject(dbmss.environment);
    });

    afterAll(() => dbmss.teardown());

    skipTestOnWindows.stdout().it('should log failed dump', async (ctx) => {
        await DumpCommand.run([testDbms.id, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain('Database does not exist: neo4j');
    });

    test.stdout().it('logs start message', async (ctx) => {
        await StartCommand.run([testDbms.name, '--environment', TEST_ENVIRONMENT_ID]);
        await waitForDbmsToBeOnline({
            ...testDbms,
            config: await dbmss.environment.dbmss.getDbmsConfig(testDbms.id),
        });

        if (process.platform === 'win32') {
            expect(ctx.stdout).toContain('neo4j started');
        } else {
            expect(ctx.stdout).toContain('Directories in use');
            expect(ctx.stdout).toContain('Starting Neo4j');
            expect(ctx.stdout).toContain('Started neo4j (pid');
        }
    });

    test.stdout().it('lists DBMSs', async (ctx) => {
        await ListCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--no-truncate']);
        expect(ctx.stdout).toContain(testDbms.name);
    });

    test.stdout().it('logs running status', async (ctx) => {
        await InfoCommand.run([testDbms.name, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain(DBMS_STATUS.STARTED);
    });

    test.stdout()
        .stdin(TestDbmss.DBMS_CREDENTIALS)
        .it('logs access token', async (ctx) => {
            await AccessTokenCommand.run([testDbms.name, '--user=neo4j', '--environment', TEST_ENVIRONMENT_ID]);
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });

    test.stdout().it('should execute cypher', async (ctx) => {
        await ExecCommand.run([
            testDbms.id,
            `--from=${path.join(testProject.root, 'return-true.cypher')}`,
            '--database=neo4j',
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        expect(ctx.stdout).toContain('OK');
    });

    test.stdout().it('should execute unterminated cypher', async (ctx) => {
        await ExecCommand.run([
            testDbms.id,
            `--from=${path.join(testProject.root, 'return-without-semicolon.cypher')}`,
            '--database=neo4j',
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        expect(ctx.stdout).toContain('OK');
    });

    test.stdout().it('should execute blank cypher', async (ctx) => {
        await ExecCommand.run([
            testDbms.id,
            `--from=${path.join(testProject.root, 'blank.cypher')}`,
            '--database=neo4j',
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        expect(ctx.stdout).toContain('OK');
    });

    test.stderr().it('should execute but complain about bad cypher syntax', async () => {
        const command = ExecCommand.run([
            testDbms.id,
            `--from=${path.join(testProject.root, 'bad-syntax.cypher')}`,
            '--database=neo4j',
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        await expect(command).rejects.toThrow(/Invalid input/);
    });

    test.stderr().it('should execute but complain about missing parameters', async () => {
        const command = ExecCommand.run([
            testDbms.id,
            `--from=${path.join(testProject.root, 'missing-param.cypher')}`,
            '--database=neo4j',
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        await expect(command).rejects.toThrow(/Expected param/);
    });

    test.stdout()
        .stderr()
        .it('logs stop message', async (ctx) => {
            await StopCommand.run([testDbms.name, '--environment', TEST_ENVIRONMENT_ID]);
            expect(ctx.stdout).toBe('');
            expect(ctx.stderr).toContain('done');
        });

    skipTestOnWindows.stdout().it('should log successful dump', async (ctx) => {
        await DumpCommand.run([
            testDbms.id,
            `--to=${path.join(envPaths().data, 'test-db.dump')}`,
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        expect(ctx.stdout).toContain('data: 100.0%');
        expect(ctx.stdout).toContain('Done:');
        expect(ctx.stdout).toContain('processed.');
    });

    skipTestOnWindows.stdout().it('should log successful load', async (ctx) => {
        await LoadCommand.run([
            testDbms.id,
            `--from=${path.join(envPaths().data, 'test-db.dump')}`,
            '--database=neo4j',
            '--force',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);
        expect(ctx.stdout).toContain('Successfully loaded data from');
    });

    test.stdout().it('logs stopped status', async (ctx) => {
        await InfoCommand.run([testDbms.name, '--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain(DBMS_STATUS.STOPPED);
    });

    test.it('errors when trying to access a non existing dbms', async () => {
        const command = InfoCommand.run(['non-existent', '--environment', TEST_ENVIRONMENT_ID]);
        const expectedError = new NotFoundError('DBMS "non-existent" not found');
        await expect(command).rejects.toThrow(expectedError);
    });
});
