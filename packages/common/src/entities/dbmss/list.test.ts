import fse from 'fs-extra';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

import {ENVIRONMENT_TYPES} from '../environments/environment.constants';
import {EnvironmentConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {LocalEnvironment} from '../environments/environment.local';
import {PropertiesFile} from '../../system/files';
import {DBMS_DIR_NAME, DBMS_MANIFEST_FILE, DISCOVER_DBMS_THROTTLE_MS} from '../../constants';

const TMP_HOME = path.join(envPaths().tmp, 'local-environment.list');

jest.mock('../../utils/files/read-properties-file', () => ({
    readPropertiesFile: (): Map<string, string> => new Map(),
}));

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

describe('LocalDbmss - list', () => {
    const dbms1 = uuidv4();
    const dbms2 = uuidv4();
    let environment: LocalEnvironment;
    let INSTALLATION_ROOT: string;

    function generateDummyConf(dbms: string): PropertiesFile {
        const configPath = path.join(INSTALLATION_ROOT, `dbms-${dbms}`, 'conf/neo4j.conf');

        return new PropertiesFile([], configPath);
    }

    beforeAll(async () => {
        const config = new EnvironmentConfigModel({
            id: uuidv4(),
            name: 'test',
            relateDataPath: TMP_HOME,
            type: ENVIRONMENT_TYPES.LOCAL,
            user: 'test',
            configPath: 'nowhere',
        });

        environment = new LocalEnvironment(config);
        INSTALLATION_ROOT = path.join(environment.dataPath, DBMS_DIR_NAME);

        await fse.ensureDir(path.join(INSTALLATION_ROOT, `dbms-${dbms1}`));
        await fse.writeJSON(path.join(INSTALLATION_ROOT, `dbms-${dbms1}`, DBMS_MANIFEST_FILE), {
            description: 'DBMS with metadata',
            id: dbms1,
            name: 'Name',
            rootPath: path.join(INSTALLATION_ROOT, `dbms-${dbms1}`),
        });
        await fse.ensureDir(path.join(INSTALLATION_ROOT, `dbms-${dbms2}`));
        await fse.writeJSON(path.join(INSTALLATION_ROOT, `dbms-${dbms2}`, DBMS_MANIFEST_FILE), {
            description: '',
            id: dbms2,
            name: '',
            rootPath: path.join(INSTALLATION_ROOT, `dbms-${dbms2}`),
        });
    });

    afterAll(() => fse.remove(TMP_HOME));

    test('list no dbmss installed', async () => {
        // Calls to discoverDbmss are throttled, so it takes some time before
        // changes are picked up.
        await sleep(DISCOVER_DBMS_THROTTLE_MS);

        const dbmss = await environment.dbmss.list();
        expect(dbmss.toArray()).toEqual([]);
    });

    // @todo: broken as we now check for conf existing
    test('list dbmss installed', async () => {
        // Calls to discoverDbmss are throttled, so it takes some time before
        // changes are picked up.
        await sleep(DISCOVER_DBMS_THROTTLE_MS);

        const expected = [
            {
                config: generateDummyConf(dbms1),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: 'DBMS with metadata',
                id: dbms1,
                name: 'Name',
                rootPath: path.join(INSTALLATION_ROOT, `dbms-${dbms1}`),
                tags: [],
                metadata: {},
                secure: false,
            },
            {
                config: generateDummyConf(dbms2),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: '',
                id: dbms2,
                name: '',
                rootPath: path.join(INSTALLATION_ROOT, `dbms-${dbms2}`),
                tags: [],
                metadata: {},
                secure: false,
            },
        ];

        const dirs = [`dbms-${dbms1}`, `dbms-${dbms2}`, 'not-a-dbms'];

        jest.spyOn(fse, 'pathExists').mockImplementation((p: string) => {
            return Promise.resolve(!p.includes('not-a-dbms'));
        });

        jest.spyOn(PropertiesFile, 'readFile').mockImplementation((p: string) => {
            return Promise.resolve(p.includes(dbms1) ? generateDummyConf(dbms1) : generateDummyConf(dbms2));
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
        // Calls to discoverDbmss are throttled, so it takes some time before
        // changes are picked up.
        await sleep(DISCOVER_DBMS_THROTTLE_MS);

        await fse.remove(path.join(INSTALLATION_ROOT, `dbms-${dbms2}`));
        const expected = [
            {
                config: generateDummyConf(dbms1),
                connectionUri: 'neo4j://127.0.0.1:7687',
                description: 'DBMS with metadata',
                id: dbms1,
                name: 'Name',
                rootPath: path.join(INSTALLATION_ROOT, `dbms-${dbms1}`),
                tags: [],
                metadata: {},
                secure: false,
            },
        ];

        const actual = await environment.dbmss.list();
        expect(actual.toArray()).toEqual(expected);
    });
});
