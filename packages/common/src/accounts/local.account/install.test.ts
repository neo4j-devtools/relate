import path from 'path';

import {ACCOUNT_TYPES} from '../account.constants';
import {AccountConfigModel, IDbms} from '../../models';
import {envPaths} from '../../utils';
import {InvalidArgumentError, NotSupportedError} from '../../errors';
import {LocalAccount} from './local.account';
import {neo4jAdminCmd} from './utils';

const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const DATA_HOME = envPaths().data;
const INSTALL_ROOT = path.join(envPaths().data, 'dbmss');
const DISTRIBUTIONS_ROOT = path.join(envPaths().cache, 'neo4j');

describe('LocalAccount - install', () => {
    let account: LocalAccount;
    beforeAll(() => {
        const config = new AccountConfigModel({
            dbmss: {},
            id: 'test',
            neo4jDataPath: DATA_HOME,
            type: ACCOUNT_TYPES.LOCAL,
            user: 'test',
        });

        account = new LocalAccount(config);
    });

    afterEach(async () => {
        const dbmss = await account.listDbmss();
        await Promise.all(dbmss.map(({id}) => account.uninstallDbms(id)));
    });

    test('with no version', async () => {
        await expect(account.installDbms('id', 'password', '')).rejects.toThrow(
            new InvalidArgumentError('Version must be specified'),
        );
    });

    test('with invalid version', async () => {
        await expect(account.installDbms('id', 'password', 'notAVersionUrlOrFilePath')).rejects.toThrow(
            new InvalidArgumentError('Provided version argument is not valid semver, url or path.'),
        );
    });

    test('with valid version (URL)', async () => {
        await expect(account.installDbms('id', 'password', 'https://valid.url.com')).rejects.toThrow(
            new NotSupportedError('fetch and install https://valid.url.com'),
        );
    });

    test('with not existing version (file path)', async () => {
        const message = 'Provided version argument is not valid semver, url or path.';

        await expect(account.installDbms('id', 'password', path.join('non', 'existing', 'path'))).rejects.toThrow(
            new InvalidArgumentError(message),
        );

        await expect(
            account.installDbms('id', 'password', path.join('non', 'existing', 'path', '4.0')),
        ).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('with valid version (file path)', async () => {
        const archive = `neo4j-enterprise-4.0.4${process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'}`;
        const archivePath = path.join(DISTRIBUTIONS_ROOT, archive);

        // TODO: change to use proper names (and use them on uninstalls?)
        const uuid = await account.installDbms('id', 'password', archivePath);
        expect(uuid).toMatch(UUID_REGEX);

        // TODO: change to check specific DBMS, not all of them
        const dbmsList: IDbms[] = await account.listDbmss();
        expect(dbmsList.length).toBe(1);
        const message = await account.statusDbmss([dbmsList[0].id]);
        expect(message[0]).toContain('Neo4j is not running');

        // TODO: use getDbmsInfo
        expect(await neo4jAdminCmd(path.join(INSTALL_ROOT, `dbms-${dbmsList[0].id}`), 'version')).toContain('4.0.4');
    });

    test('with version in unsupported range (semver)', async () => {
        await expect(account.installDbms('id', 'password', '3.1')).rejects.toThrow(
            new NotSupportedError('version not in range >=4.x'),
        );
    });

    test('with valid, non cached version (semver)', async () => {
        await expect(account.installDbms('id', 'password', '5.0')).rejects.toThrow(
            new NotSupportedError('version doesnt exist, so will attempt to download and install'),
        );
    });

    test('with valid version (semver)', async () => {
        let dbmsList: IDbms[];
        let message: string[];

        // TODO: get this version in some other way
        await account.installDbms('id', 'password', '4.0.4');
        // TODO: change to check specific DBMS, not all of them

        dbmsList = await account.listDbmss();
        expect(dbmsList.length).toBe(1);
        message = await account.statusDbmss([dbmsList[0].id]);
        expect(message[0]).toContain('Neo4j is not running');
        // TODO: use getDbmsInfo
        expect(await neo4jAdminCmd(path.join(INSTALL_ROOT, `dbms-${dbmsList[0].id}`), 'version')).toContain('4.0.4');

        await account.installDbms('id', 'password', '4.0.4');
        // TODO: change to check specific DBMS, not all of them

        dbmsList = await account.listDbmss();
        expect(dbmsList.length).toBe(2);
        message = await account.statusDbmss([dbmsList[1].id]);
        expect(message[0]).toContain('Neo4j is not running');
        // TODO: use getDbmsInfo
        expect(await neo4jAdminCmd(path.join(INSTALL_ROOT, `dbms-${dbmsList[1].id}`), 'version')).toContain('4.0.4');
    });
});
