import {test} from '@oclif/test';

describe('hello works ok', () => {
    test.stdout()
        .command(['hello', 'you'])
        .it('log expected output', (ctx) => {
            expect(ctx.stdout).toEqual('Hello you\n');
        });
});
