import fse from 'fs-extra';
import path from 'path';

import {ACCOUNT_TYPES} from '../account.constants';
import {AccountConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {LocalAccount} from './local.account';

const TMP_HOME = path.join(envPaths().tmp, 'local-account.list');
const INSTALLATION_ROOT = path.join(TMP_HOME, 'dbmss');

describe('LocalAccount - list', () => {
    let account: LocalAccount;

    beforeAll(async () => {
        await fse.ensureDir(INSTALLATION_ROOT);

        const config = new AccountConfigModel({
            dbmss: {
                '6bb553ba': {
                    connectionUri: 'nowhere',
                    description: 'DBMS with metadata',
                    id: '6bb553ba',
                    name: 'Name',
                },
                e0aef2ad: {
                    connectionUri: 'nowhere',
                    description: 'DBMS present in the config but not in the DBMS dir.',
                    id: 'e0aef2ad',
                    name: "Shouldn't be listed",
                },
            },
            id: 'test',
            neo4jDataPath: TMP_HOME,
            type: ACCOUNT_TYPES.LOCAL,
            user: 'test',
        });

        account = new LocalAccount(config);
    });

    afterAll(() => fse.remove(TMP_HOME));

    test('list no dbmss installed', async () => {
        const dbmss = await account.listDbmss();
        expect(dbmss).toEqual([]);
    });

    test('list dbmss installed', async () => {
        const expected = [
            {
                connectionUri: 'nowhere',
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
            },
            {
                connectionUri: 'nowhere',
                description: '',
                id: '998f936e',
                name: '',
            },
        ];

        const dirs = ['dbms-6bb553ba', 'dbms-998f936e', 'not-a-dbms'];
        const createDirs = dirs.map((dbms) => fse.ensureDir(path.join(INSTALLATION_ROOT, dbms)));
        await Promise.all(createDirs);

        const actual = await account.listDbmss();
        const sortedActual = actual.sort((a, b) => {
            if (a.name > b.name) {
                return -1;
            }
            if (b.name > a.name) {
                return 1;
            }
            return 0;
        });
        expect(sortedActual).toEqual(expected);
    });

    test('do not list removed dbmss', async () => {
        const dbmsId = '998f936e';
        await fse.remove(path.join(INSTALLATION_ROOT, `dbms-${dbmsId}`));
        const expected = [
            {
                connectionUri: 'nowhere',
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
            },
        ];

        const actual = await account.listDbmss();
        expect(actual).toEqual(expected);
    });
});
