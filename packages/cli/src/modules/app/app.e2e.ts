import {test} from '@oclif/test';
import {TestDbmss, TestExtensions, IInstalledExtension} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import OpenCommand from '../../commands/app/open';
import StartCommand from '../../commands/dbms/start';

const appRoot = 'fakeRoot';

jest.mock('cli-ux', () => {
    return {
        open: (): Promise<void> => Promise.resolve(),
    };
});

jest.mock('node-fetch', () => {
    return () =>
        Promise.resolve({
            ok: true,
            json: () => ({appRoot}),
        });
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ENVIRONMENT_ID = 'test';
let TEST_DB_NAME: string;

describe('$relate app', () => {
    const dbmss = new TestDbmss(__filename);
    const extensions = new TestExtensions(__filename);
    let testExtension: IInstalledExtension;

    beforeAll(async () => {
        const {name} = await dbmss.createDbms();
        testExtension = await extensions.installNew();

        TEST_DB_NAME = name;
    });

    afterAll(async () => {
        await Promise.all([extensions.teardown(), dbmss.teardown()]);
    });

    test.stdout().it('logs app launch token', async (ctx) => {
        await StartCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);

        await AccessTokenCommand.run([
            TEST_DB_NAME,
            '--user=neo4j',
            `--credentials=${TestDbmss.DBMS_CREDENTIALS}`,
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);

        await OpenCommand.run([
            testExtension.name,
            `--dbmsId=${TEST_DB_NAME}`,
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
            '-L',
        ]);

        expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
    });
});
