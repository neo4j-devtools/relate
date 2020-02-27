import {test} from '@oclif/test';

jest.setTimeout(30000);

jest.mock('@relate/common', () => ({
    ...jest.requireActual('@relate/common'),
    writePropertiesFile: Promise.resolve,
}));

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

describe('$relate dbms', () => {
    test.stdout()
        .command(['dbms:start', 'test'])
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
        .command(['dbms:status', 'test'])
        .it('logs running status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is running');
        });

    test.stdout()
        // arbitrary wait for Neo4j to come online
        .do(() => new Promise((resolve) => setTimeout(resolve, 10000)))
        .command(['dbms:access', 'test', '-p neo4j', '-c newpassword'])
        .it('logs access token', (ctx) => {
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });

    test.stdout()
        .command(['dbms:stop', 'test'])
        .it('logs stop message', (ctx) => {
            if (process.platform === 'win32') {
                expect(ctx.stdout).toContain('Neo4j service stopped');
            } else {
                expect(ctx.stdout).toContain('Stopping Neo4j');
                expect(ctx.stdout).toContain('stopped');
            }
        });

    test.stdout()
        .command(['dbms:status', 'test'])
        .it('logs stopped status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is not running');
        });

    test.stdout()
        .command(['dbms:status', 'non-existent'])
        .catch((ctx) => {
            expect(ctx.message).toContain('DBMS "non-existent" not found');
        })
        .it('errors when trying to access a non existing dbms');
});
