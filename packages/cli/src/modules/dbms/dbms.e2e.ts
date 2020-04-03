import {test} from '@oclif/test';

jest.setTimeout(35000);

jest.mock('fs-extra', () => {
    return {
        writeFile: (_path: string, data: string) => Promise.resolve(data),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

describe('$relate dbms', () => {
    test.stdout()
        .command(['dbms:start', 'test', '--account=test'])
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
        .command(['dbms:list', '--account=test'])
        .it('lists DBMSs', (ctx) => {
            expect(ctx.stdout).toContain('test');
        });

    test.stdout()
        .command(['dbms:status', 'test', '--account=test'])
        .it('logs running status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is running');
        });

    test.stdout()
        // arbitrary wait for Neo4j to come online
        .do(() => new Promise((resolve) => setTimeout(resolve, 25000)))
        .command(['dbms:access-token', 'test', '--principal=neo4j', '--credentials=newpassword', '--account=test'])
        .it('logs access token', (ctx) => {
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });

    test.stdout()
        .stderr()
        .command(['dbms:stop', 'test', '--account=test'])
        .it('logs stop message', (ctx) => {
            expect(ctx.stdout).toBe('');
            expect(ctx.stderr).toContain('done');
        });

    test.stdout()
        .command(['dbms:status', 'test', '--account=test'])
        .it('logs stopped status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is not running');
        });

    test.stdout()
        .command(['dbms:status', 'non-existent', '--account=test'])
        .catch((ctx) => {
            expect(ctx.message).toContain('DBMS "non-existent" not found');
        })
        .it('errors when trying to access a non existing dbms');
});
