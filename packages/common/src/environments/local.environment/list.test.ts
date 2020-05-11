import fse from 'fs-extra';
import path from 'path';

import {ENVIRONMENT_TYPES} from '../environment.constants';
import {EnvironmentConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {LocalEnvironment} from './local.environment';
import {PropertiesFile} from '../../system/files';

const TMP_HOME = path.join(envPaths().tmp, 'local-environment.list');
const INSTALLATION_ROOT = path.join(TMP_HOME, 'dbmss');

jest.mock('../../utils/read-properties-file', () => ({
    readPropertiesFile: () => new Map(),
}));

function generateDummyConf(dbms: string): PropertiesFile {
    const configPath = path.join(INSTALLATION_ROOT, `dbms-${dbms}`, 'conf/neo4j.conf');

    return new PropertiesFile(new Map(), configPath);
}

describe('LocalEnvironment - list', () => {
    let environment: LocalEnvironment;

    beforeAll(async () => {
        await fse.ensureDir(INSTALLATION_ROOT);

        const config = new EnvironmentConfigModel({
            dbmss: {
                '6bb553ba': {
                    connectionUri: 'neo4j://127.0.0.1:7687',
                    config: generateDummyConf('6bb553ba'),
                    description: 'DBMS with metadata',
                    id: '6bb553ba',
                    name: 'Name',
                    rootPath: path.join(INSTALLATION_ROOT, 'dbms-6bb553ba'),
                },
                e0aef2ad: {
                    connectionUri: 'neo4j://127.0.0.1:7687',
                    config: generateDummyConf('e0aef2ad'),
                    description: 'DBMS present in the config but not in the DBMS dir.',
                    id: 'e0aef2ad',
                    name: "Shouldn't be listed",
                    rootPath: path.join(INSTALLATION_ROOT, 'dbms-e0aef2ad'),
                },
            },
            id: 'test',
            neo4jDataPath: TMP_HOME,
            type: ENVIRONMENT_TYPES.LOCAL,
            user: 'test',
        });

        environment = new LocalEnvironment(config, 'nowhere');
    });

    afterAll(() => fse.remove(TMP_HOME));

    test('list no dbmss installed', async () => {
        const dbmss = await environment.listDbmss();
        expect(dbmss).toEqual([]);
    });

    // @todo: broken as we now check for conf existing
    test('list dbmss installed', async () => {
        const expected = [
            {
                config: generateDummyConf('6bb553ba'),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
                rootPath: path.join(INSTALLATION_ROOT, 'dbms-6bb553ba'),
            },
            {
                config: generateDummyConf('998f936e'),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: '',
                id: '998f936e',
                name: '',
                rootPath: path.join(INSTALLATION_ROOT, 'dbms-998f936e'),
            },
        ];

        const dirs = ['dbms-6bb553ba', 'dbms-998f936e', 'not-a-dbms'];

        jest.spyOn(fse, 'pathExists').mockImplementation((p: string) => {
            return Promise.resolve(!p.includes('not-a-dbms'));
        });

        jest.spyOn(PropertiesFile, 'readFile').mockImplementation((p: string) => {
            return Promise.resolve(
                p.includes('6bb553ba') ? generateDummyConf('6bb553ba') : generateDummyConf('998f936e'),
            );
        });

        const createDirs = dirs.map((dbms) => fse.ensureDir(path.join(INSTALLATION_ROOT, dbms)));
        await Promise.all(createDirs);

        const actual = await environment.listDbmss();
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
    test('do not list removed dbmss', async () => {
        const dbmsId = '998f936e';
        await fse.remove(path.join(INSTALLATION_ROOT, `dbms-${dbmsId}`));
        const expected = [
            {
                config: generateDummyConf('6bb553ba'),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: 'DBMS with metadata',
                id: '6bb553ba',
                name: 'Name',
                rootPath: path.join(INSTALLATION_ROOT, 'dbms-6bb553ba'),
            },
        ];

        const actual = await environment.listDbmss();
        expect(actual).toEqual(expected);
    });
});
