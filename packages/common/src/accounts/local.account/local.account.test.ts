/* eslint-disable max-len */
import fse from 'fs-extra';
import path from 'path';

import {AccountConfigModel, IDbms} from '../../models';
import {ACCOUNT_TYPES} from '../account.constants';
import {envPaths} from '../../utils/env-paths';
import {LocalAccount} from './local.account';
import {InvalidArgumentError, NotSupportedError} from '../../errors';
import {neo4jAdminCmd} from './neo4j-admin-cmd';

const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

// seriously windows... (ノಠ益ಠ)ノ彡 sǝldᴉɔuᴉɹd
jest.setTimeout(60000);

describe('Local account', () => {
    const dbmsRoot = path.join(envPaths().tmp, 'dbmss');
    let account: LocalAccount;

    describe('list dbmss', () => {
        beforeAll(async () => {
            await fse.ensureDir(dbmsRoot);

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

        afterAll(() => fse.remove(envPaths().tmp));

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
            const createDirs = dirs.map((dbms) => fse.ensureDir(path.join(dbmsRoot, dbms)));
            await Promise.all(createDirs);

            const actual = await account.listDbmss();
            expect(actual).toEqual(expected);
        });

        test('do not list removed dbmss', async () => {
            const dbmsId = '998f936e';
            await fse.remove(path.join(dbmsRoot, `dbms-${dbmsId}`));
            const expected = [
                {
                    description: 'DBMS with metadata',
                    id: '6bb553ba',
                    name: 'Name',
                },
            ];

            const actual = await account.listDbmss();
            expect(actual).toEqual(expected);
        });
    });

    describe('install dbms', () => {
        // @todo: these tests need better to be better organised.
        beforeAll(async () => {
            await fse.ensureDir(dbmsRoot);
            await fse.ensureDir(path.join(envPaths().cache, 'neo4j'));
            const config = new AccountConfigModel({
                dbmss: {},
                id: 'test',
                neo4jDataPath: envPaths().tmp,
                type: ACCOUNT_TYPES.LOCAL,
                user: 'test',
            });

            account = new LocalAccount(config);
        });

        afterAll(async () => {
            await fse.remove(path.join(envPaths().cache, 'neo4j', 'neo4j-enterprise-4.0.4'));
            await fse.remove(dbmsRoot);
        });

        afterEach(async () => {
            const dbmss = await account.listDbmss();
            await Promise.all(dbmss.map(({id}) => account.uninstallDbms(id)));
        });

        test('install dbms with no version arg passed', async () => {
            await expect(account.installDbms('id', 'password', '')).rejects.toThrow(
                new InvalidArgumentError('Version must be specified'),
            );
        });

        test('install dbms with invalid version arg passed', async () => {
            await expect(account.installDbms('id', 'password', 'notAVersionUrlOrFilePath')).rejects.toThrow(
                new InvalidArgumentError('Provided version argument is not valid semver, url or path.'),
            );
        });

        // url
        test('install dbms with valid URL version arg passed', async () => {
            await expect(account.installDbms('id', 'password', 'https://valid.url.com')).rejects.toThrow(
                new NotSupportedError('fetch and install https://valid.url.com'),
            );
        });

        // file path
        test('install dbms with valid file path version arg passed but no such path exists', async () => {
            const message = 'Provided version argument is not valid semver, url or path.';

            await expect(account.installDbms('id', 'password', path.join('path', 'to', 'version'))).rejects.toThrow(
                new InvalidArgumentError(message),
            );

            await expect(
                account.installDbms('id', 'password', path.join('path', 'to', 'version', '4.0')),
            ).rejects.toThrow(new InvalidArgumentError(message));
        });

        test('install dbms with valid file path version arg passed', async () => {
            const archive = `neo4j-enterprise-4.0.4${process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'}`;
            const uuid = await account.installDbms('id', 'password', path.join(envPaths().cache, 'neo4j', archive));
            expect(uuid).toMatch(UUID_REGEX);

            const dbmsList: IDbms[] = await account.listDbmss();
            expect(dbmsList.length).toBe(1);
            const message = await account.statusDbmss([dbmsList[0].id]);
            expect(message[0]).toContain('Neo4j is not running');
            expect(await neo4jAdminCmd(path.join(dbmsRoot, `dbms-${dbmsList[0].id}`), 'version')).toContain('4.0.4');
        });

        // semver
        test('install dbms with valid semver version arg passed but not in the supported range', async () => {
            await expect(account.installDbms('id', 'password', '3.1')).rejects.toThrow(
                new NotSupportedError('version not in range >=4.x'),
            );
        });

        test('install dbms with valid semver version arg passed but is not found in cache', async () => {
            await expect(account.installDbms('id', 'password', '5')).rejects.toThrow(
                new NotSupportedError('version doesnt exist, so will attempt to download and install'),
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
        });
    });
});
