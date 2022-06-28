import {test} from '@oclif/test';

import {CypherParameterError, TestDbmss, IDbmsInfo} from '@relate/common';
import CreateCommand from '../../commands/db/create';
import DropCommand from '../../commands/db/drop';
import AccessTokenCommand from '../../commands/dbms/access-token';
import StartCommand from '../../commands/dbms/start';

jest.mock('../../prompts', () => {
    return {
        passwordPrompt: (): Promise<string> => Promise.resolve(TestDbmss.DBMS_CREDENTIALS),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_DB_NAME = 'testDatabase';

describe('$relate db', () => {
    let dbmss: TestDbmss;
    let testEnvironmentId: string;
    let testDbms: IDbmsInfo;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        testDbms = await dbmss.createDbms();
        testEnvironmentId = dbmss.environment.id;
    });

    afterAll(() => dbmss.teardown());

    test.stdout()
        .stderr()
        .it('creates a database', async (ctx) => {
            await StartCommand.run([testDbms.id, '--environment', testEnvironmentId]);
            await AccessTokenCommand.run([testDbms.id, '--environment', testEnvironmentId, '--user=neo4j']);

            if (process.platform === 'win32') {
                expect(ctx.stdout).toContain('neo4j started');
            } else {
                expect(ctx.stdout).toContain('Directories in use');
                expect(ctx.stdout).toContain('Starting Neo4j');
                expect(ctx.stdout).toContain('Started neo4j (pid');
            }
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));

            await CreateCommand.run([
                TEST_DB_NAME,
                '--environment',
                testEnvironmentId,
                '--dbms',
                testDbms.id,
                '--user=neo4j',
            ]);

            expect(ctx.stderr).toContain('done');
        });

    test.it('fails with cypher param error', async () => {
        const command = CreateCommand.run([
            'name with spaces',
            '--environment',
            testEnvironmentId,
            '--dbms',
            testDbms.id,
            '--user=neo4j',
        ]);

        await expect(() => command).rejects.toThrow(
            new CypherParameterError('Cannot safely pass "name with spaces" as a Cypher parameter'),
        );
    });

    test.it('fails to create database when it exists', async () => {
        expect.hasAssertions();

        try {
            await CreateCommand.run([
                TEST_DB_NAME,
                '--environment',
                testEnvironmentId,
                '--dbms',
                testDbms.id,
                '--user=neo4j',
            ]);
        } catch (err) {
            expect(err.message).toContain('Database');
            expect(err.message).toContain('already exists');
        }
    });

    test.stderr().it('drops a database', async (ctx) => {
        await DropCommand.run([TEST_DB_NAME, '--environment', testEnvironmentId, '--dbms', testDbms.id]);

        expect(ctx.stderr).toContain('done');
    });

    test.it('fails to drop non-existing database', async () => {
        expect.hasAssertions();

        try {
            await DropCommand.run([TEST_DB_NAME, '--environment', testEnvironmentId, '--dbms', testDbms.id]);
        } catch (err) {
            expect(err.message).toContain('Database does not exist.');
        }
    });
});
