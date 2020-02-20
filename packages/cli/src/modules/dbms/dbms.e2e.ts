import {test} from '@oclif/test';

describe('$relate dbms', () => {
    test.stdout()
        .command(['dbms:start', 'test'])
        .it('logs start message', (ctx) => {
            expect(ctx.stdout).toContain('Directories in use');
            expect(ctx.stdout).toContain('Starting Neo4j');
            expect(ctx.stdout).toContain('Started neo4j (pid');
        });

    test.stdout()
        .command(['dbms:status', 'test'])
        .it('logs running status', (ctx) => {
            expect(ctx.stdout).toContain('Neo4j is running at pid');
        });

    test.stdout()
        .command(['dbms:stop', 'test'])
        .it('logs stop message', (ctx) => {
            expect(ctx.stdout).toContain('Stopping Neo4j');
            expect(ctx.stdout).toContain('stopped');
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
