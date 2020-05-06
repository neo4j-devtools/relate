import fse from 'fs-extra';
import path from 'path';

import {ACCOUNT_TYPES} from '../account.constants';
import {AccountConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {LocalAccount} from './local.account';
import {PropertiesFile} from '../../system/files';

const TMP_HOME = path.join(envPaths().tmp, 'local-account.list');
const INSTALLATION_ROOT = path.join(TMP_HOME, 'dbmss');

jest.mock('../../utils/read-properties-file', () => ({
    readPropertiesFile: () => new Map(),
}));

function generateDummyConf(dbms: string): PropertiesFile {
    const configPath = path.join(INSTALLATION_ROOT, `dbms-${dbms}`, 'conf/neo4j.conf');

    return new PropertiesFile(new Map(), configPath);
}

describe('LocalAccount - list', () => {
    let account: LocalAccount;

    beforeAll(async () => {
        await fse.ensureDir(INSTALLATION_ROOT);

        const config = new AccountConfigModel({
            dbmss: {
                '6bb553ba': {
                    connectionUri: 'neo4j://127.0.0.1:7687',
                    config: generateDummyConf('6bb553ba'),
                    description: 'DBMS with metadata',
                    id: '6bb553ba',
                    name: 'Name',
                },
                e0aef2ad: {
                    connectionUri: 'neo4j://127.0.0.1:7687',
                    config: generateDummyConf('e0aef2ad'),
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

    // @todo: broken as we now check for conf existing
    test.skip('list dbmss installed', async () => {
        const expected = [
            {
                connectionUri: 'neo4j://127.0.0.1:7687',
                config: generateDummyConf('6bb553ba'),
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
            },
            {
                connectionUri: 'neo4j://127.0.0.1:7687',
                config: generateDummyConf('998f936e'),
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

    // @todo: broken as we now check for conf existing
    test.skip('do not list removed dbmss', async () => {
        const dbmsId = '998f936e';
        await fse.remove(path.join(INSTALLATION_ROOT, `dbms-${dbmsId}`));
        const expected = [
            {
                connectionUri: 'neo4j://127.0.0.1:7687',
                config: generateDummyConf('6bb553ba'),
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
            },
        ];

        const actual = await account.listDbmss();
        expect(actual).toEqual(expected);
    });
});
