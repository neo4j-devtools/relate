import {ensureDir, remove} from 'fs-extra';
import path from 'path';

import {AccountConfigModel} from '../../models/account-config.model';
import {ACCOUNT_TYPES} from '../account.constants';
import {envPaths} from '../../utils/env-paths';
import {LocalAccount} from './local.account';

describe('Local account', () => {
    const dbmsRoot = path.join(envPaths().tmp, 'dbmss');
    let account: LocalAccount;

    beforeAll(async () => {
        await ensureDir(dbmsRoot);

        const config = new AccountConfigModel({
            dbmss: {
                '6bb553ba': {
                    description: 'DBMS with metadata',
                    id: '6bb553ba',
                    name: 'Name',
                },
                e0aef2ad: {
                    description: 'DBMS present in the config but not in the DBMS dir.',
                    id: 'e0aef2ad',
                    name: "Shouldn't be listed",
                },
            },
            id: 'test',
            neo4jDataPath: envPaths().tmp,
            type: ACCOUNT_TYPES.LOCAL,
            user: 'test',
        });

        account = new LocalAccount(config);
    });

    afterAll(() => remove(envPaths().tmp));

    test('list dbmss (no dbmss installed)', async () => {
        const dbmss = await account.listDbmss();
        expect(dbmss).toEqual([]);
    });

    test('list dbmss (dbmss installed)', async () => {
        const expected = [
            {
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
            },
            {
                description: '',
                id: '998f936e',
                name: '',
            },
        ];

        const dirs = ['dbms-6bb553ba', 'dbms-998f936e', 'not-a-dbms'];
        const createDirs = dirs.map((dbms) => ensureDir(path.join(dbmsRoot, dbms)));
        await Promise.all(createDirs);

        const actual = await account.listDbmss();
        expect(actual.sort()).toEqual(expected);
    });
});
