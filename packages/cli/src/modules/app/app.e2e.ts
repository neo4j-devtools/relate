import {test} from '@oclif/test';

jest.mock('cli-ux', () => {
    return {
        open: () => Promise.resolve(),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

describe('$relate app', () => {
    test.stdout()
        .skip()
        .command(['dbms:access-token', 'test', '--principal=neo4j', '--credentials=newpassword', '--account=test'])
        .command(['app:launch', 'test', '--dbmsId=test', '--principal=neo4j', '--accountId=test'])
        .it('logs app launch token', (ctx) => {
            expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
        });
});
