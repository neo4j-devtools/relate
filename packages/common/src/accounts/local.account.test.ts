import {ensureDir, remove} from 'fs-extra';
import path from 'path';

import {AccountConfigModel} from '../models/account-config.model';
import {LocalAccount} from './local.account';
import {ACCOUNT_TYPES} from './account.constants';
import {envPaths} from '../utils/env-paths';

describe('Local account', () => {
    const dbmsRoot = path.join(envPaths().tmp, 'dbmss');
    let account: LocalAccount;

    beforeAll(async () => {
        await ensureDir(dbmsRoot);

        const config = new AccountConfigModel({
            id: 'test',
            user: 'test',
            neo4jDataPath: envPaths().tmp,
            type: ACCOUNT_TYPES.LOCAL,
        });

        account = new LocalAccount(config);
    });

    afterAll(() => remove(envPaths().tmp));

    test('list dbmss (no dbmss installed)', async () => {
        const dbmss = await account.listDbmss();
        expect(dbmss).toEqual([]);
    });

    test('list dbmss (dbmss installed)', async () => {
        const expected = ['bar', 'baz', 'foo'];
        const createDirs = expected.map((dbms) => ensureDir(path.join(dbmsRoot, dbms)));

        await Promise.all(createDirs);

        const actual = await account.listDbmss();
        expect(actual.sort()).toEqual(expected);
    });
});
