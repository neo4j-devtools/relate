import {test} from '@oclif/test';
import {CliUx} from '@oclif/core';
import {TestDbmss, TestExtensions, IInstalledExtension, IDbmsInfo, waitForDbmsToBeOnline} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import OpenCommand from '../../commands/app/open';
import StartCommand from '../../commands/dbms/start';

const appRoot = '/fakeRoot';

jest.spyOn(CliUx.ux, 'open').mockReturnValue(Promise.resolve());

jest.mock('node-fetch', () => {
    return () =>
        Promise.resolve({
            ok: true,
            json: () => ({appRoot}),
        });
});

jest.mock('../../prompts', () => {
    return {
        passwordPrompt: (): Promise<string> => Promise.resolve(TestDbmss.DBMS_CREDENTIALS),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ENVIRONMENT_ID = 'test';

describe('$relate app', () => {
    let dbmss: TestDbmss;
    let testDbms: IDbmsInfo;
    let extensions: TestExtensions;
    let testExtension: IInstalledExtension;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        extensions = await TestExtensions.init(__filename, dbmss.environment);
        testDbms = await dbmss.createDbms();
        testExtension = await extensions.installNew();
    });

    afterAll(async () => {
        await Promise.all([extensions.teardown(), dbmss.teardown()]);
    });

    test.stdout().it('logs app launch token', async (ctx) => {
        await StartCommand.run([testDbms.name, '--environment', TEST_ENVIRONMENT_ID]);
        await waitForDbmsToBeOnline({
            ...testDbms,
            config: await dbmss.environment.dbmss.getDbmsConfig(testDbms.id),
        });
        await AccessTokenCommand.run([testDbms.name, '--user=neo4j', `--environment=${TEST_ENVIRONMENT_ID}`]);

        await OpenCommand.run([
            testExtension.name,
            `--dbmsId=${testDbms.name}`,
            '--user=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
            '-L',
        ]);

        expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
    });
});
