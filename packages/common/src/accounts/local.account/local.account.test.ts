import {ensureDir, remove} from 'fs-extra';
import path from 'path';

import {AccountConfigModel, IDbms} from '../../models/account-config.model';
import {ACCOUNT_TYPES} from '../account.constants';
import {envPaths} from '../../utils/env-paths';
import {LocalAccount} from './local.account';
import {InvalidArgumentError, InvalidPathError, NotSupportedError, UndefinedError} from '../../errors';
import {neo4jAdminCmd} from './neo4j-admin-cmd';

describe('Local account', () => {
    const dbmsRoot = path.join(envPaths().tmp, 'dbmss');
    let account: LocalAccount;

    describe('list dbmss', () => {
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
                id: 'foo',
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

    describe('install dbms', () => {
        beforeAll(async () => {
            await ensureDir(dbmsRoot);

            const config = new AccountConfigModel({
                dbmss: {},
                id: 'foo',
                neo4jDataPath: envPaths().tmp,
                type: ACCOUNT_TYPES.LOCAL,
                user: 'test',
            });

            account = new LocalAccount(config);
        });

        afterAll(() => remove(envPaths().tmp));

        test('install dbms with no version arg passed', async () => {
            await expect(account.installDbms('id', 'password', '')).rejects.toThrow(
                new UndefinedError('version undefined'),
            );
        });

        test('install dbms with invalid version arg passed', async () => {
            await expect(account.installDbms('id', 'password', 'notAVersionUrlOrFilePath')).rejects.toThrow(
                new InvalidArgumentError('unable to install. Cannot resolve version argument'),
            );
        });

        test('install dbms with valid URL version arg passed', async () => {
            await expect(account.installDbms('id', 'password', 'https://valid.url.com')).resolves.toBe(
                'fetch and install https://valid.url.com',
            );
        });

        test('install dbms with valid file path version arg passed but no such path exists', async () => {
            await expect(account.installDbms('id', 'password', path.join('path', 'to', 'version'))).rejects.toThrow(
                new InvalidPathError('supplied path for version is invalid'),
            );
        });

        test('install dbms with valid semver version arg passed but not in the supported range', async () => {
            await expect(account.installDbms('id', 'password', '3.1')).rejects.toThrow(
                new NotSupportedError('version not in range >=4.x'),
            );
        });

        test('install dbms with valid semver version arg passed but is not found in cache', async () => {
            await expect(account.installDbms('id', 'password', '5')).resolves.toBe(
                'version doesnt exist, so will attempt to download and install',
            );
        });

        test('install dbms with valid semver version arg passed', async () => {
            let dbmsList: IDbms[];
            let message: string[];

            await account.installDbms('id', 'password', '4.0.4');
            dbmsList = await account.listDbmss();
            expect(dbmsList.length).toBe(1);
            message = await account.statusDbmss([dbmsList[0].id]);
            expect(message[0]).toContain('Neo4j is not running');
            expect(await neo4jAdminCmd(path.join(dbmsRoot, `dbms-${dbmsList[0].id}`), 'version')).toContain('4.0.4');

            await account.installDbms('id', 'password', '4.0.4');
            dbmsList = await account.listDbmss();
            expect(dbmsList.length).toBe(2);
            message = await account.statusDbmss([dbmsList[1].id]);
            expect(message[0]).toContain('Neo4j is not running');
            expect(await neo4jAdminCmd(path.join(dbmsRoot, `dbms-${dbmsList[1].id}`), 'version')).toContain('4.0.4');
        }, 20000);
    });
});
