import fse from 'fs-extra';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

import {ENVIRONMENT_TYPES} from '../environments/environment.constants';
import {EnvironmentConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {LocalEnvironment} from '../environments/environment.local';
import {PropertiesFile} from '../../system/files';
import {DBMS_DIR_NAME, DBMS_MANIFEST_FILE} from '../../constants';

const TMP_HOME = path.join(envPaths().tmp, 'local-environment.list');
const INSTALLATION_ROOT = path.join(TMP_HOME, DBMS_DIR_NAME);

jest.mock('../../utils/files/read-properties-file', () => ({
    readPropertiesFile: (): Map<string, string> => new Map(),
}));

function generateDummyConf(dbms: string): PropertiesFile {
    const configPath = path.join(INSTALLATION_ROOT, `dbms-${dbms}`, 'conf/neo4j.conf');

    return new PropertiesFile([], configPath);
}

describe('LocalEnvironment - list', () => {
    let environment: LocalEnvironment;

    beforeAll(async () => {
        const dbms1 = 'dbms-6bb553ba';
        const dbms2 = 'dbms-998f936e';
        await fse.ensureDir(path.join(INSTALLATION_ROOT, dbms1));
        await fse.writeJSON(path.join(INSTALLATION_ROOT, dbms1, DBMS_MANIFEST_FILE), {
            description: 'DBMS with metadata',
            id: '6bb553ba',
            name: 'Name',
            rootPath: path.join(INSTALLATION_ROOT, dbms1),
        });
        await fse.ensureDir(path.join(INSTALLATION_ROOT, dbms2));
        await fse.writeJSON(path.join(INSTALLATION_ROOT, dbms2, DBMS_MANIFEST_FILE), {
            description: '',
            id: '998f936e',
            name: '',
            rootPath: path.join(INSTALLATION_ROOT, dbms2),
        });

        const config = new EnvironmentConfigModel({
            id: uuidv4(),
            name: 'test',
            relateDataPath: TMP_HOME,
            type: ENVIRONMENT_TYPES.LOCAL,
            user: 'test',
            configPath: 'nowhere',
        });

        environment = new LocalEnvironment(config);
    });

    afterAll(() => fse.remove(TMP_HOME));

    test('list no dbmss installed', async () => {
        const dbmss = await environment.dbmss.list();
        expect(dbmss.toArray()).toEqual([]);
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
                tags: [],
                secure: false,
            },
            {
                config: generateDummyConf('998f936e'),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: '',
                id: '998f936e',
                name: '',
                rootPath: path.join(INSTALLATION_ROOT, 'dbms-998f936e'),
                tags: [],
                secure: false,
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

        const actual = await environment.dbmss.list();
        const sortedActual = actual.sort((a, b) => {
            if (a.name > b.name) {
                return -1;
            }
            if (b.name > a.name) {
                return 1;
            }
            return 0;
        });
        expect(sortedActual.toArray()).toEqual(expected);
    });

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
                tags: [],
                secure: false,
            },
        ];

        const actual = await environment.dbmss.list();
        expect(actual.toArray()).toEqual(expected);
    });
});
