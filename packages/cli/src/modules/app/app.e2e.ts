import {test} from '@oclif/test';
import {envPaths, EXTENSION_DIR_NAME, EXTENSION_TYPES, TestDbmss} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';

import AccessTokenCommand from '../../commands/dbms/access-token';
import OpenCommand from '../../commands/app/open';
import StartCommand from '../../commands/dbms/start';

jest.mock('cli-ux', () => {
    return {
        open: () => Promise.resolve(),
    };
});

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const TEST_ENVIRONMENT_ID = 'test';
const TEST_APP_ID = 'foo';
const TEST_APP_FILE = path.join(envPaths().data, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC, TEST_APP_ID, 'index.html');
let TEST_DB_NAME: string;

describe('$relate app', () => {
    const dbmss = new TestDbmss(__filename);

    beforeAll(async () => {
        const {name} = await dbmss.createDbms();

        await fse.ensureFile(TEST_APP_FILE);

        TEST_DB_NAME = name;
    });

    afterAll(async () => {
        await fse.unlink(TEST_APP_FILE);

        return dbmss.teardown();
    });

    test.stdout().it('logs app launch token', async (ctx) => {
        await StartCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);

        // arbitrary wait for Neo4j to come online
        await new Promise((resolve) => setTimeout(resolve, 25000));

        await AccessTokenCommand.run([
            TEST_DB_NAME,
            '--principal=neo4j',
            `--credentials=${TestDbmss.DBMS_CREDENTIALS}`,
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);

        await OpenCommand.run([
            TEST_APP_ID,
            `--dbmsId=${TEST_DB_NAME}`,
            '--principal=neo4j',
            `--environment=${TEST_ENVIRONMENT_ID}`,
        ]);

        expect(ctx.stdout).toEqual(expect.stringMatching(JWT_REGEX));
    });
});
