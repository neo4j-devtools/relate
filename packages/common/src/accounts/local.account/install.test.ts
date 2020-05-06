import path from 'path';

import {ACCOUNT_TYPES} from '../account.constants';
import {AccountConfigModel} from '../../models';
import {TestDbmss} from '../account.utils';
import {envPaths} from '../../utils';
import {getDistributionInfo} from './utils';
import {InvalidArgumentError, NotSupportedError, NotFoundError} from '../../errors';
import {LocalAccount} from './local.account';
import * as downloadNeo4j from './utils/download-neo4j';
import * as dbmsVersions from './utils/dbms-versions';

const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const DATA_HOME = envPaths().data;
const INSTALL_ROOT = path.join(envPaths().data, 'dbmss');
const DISTRIBUTIONS_ROOT = path.join(envPaths().cache, 'neo4j');
const TEST_NEO4J_VERSION = process.env.TEST_NEO4J_VERSION || '';

describe('LocalAccount - install', () => {
    let account: LocalAccount;
    let dbmss: TestDbmss;

    beforeAll(() => {
        const config = new AccountConfigModel({
            dbmss: {},
            id: 'test',
            neo4jDataPath: DATA_HOME,
            type: ACCOUNT_TYPES.LOCAL,
            user: 'test',
        });

        account = new LocalAccount(config);
        dbmss = new TestDbmss(__filename, account);
    });

    afterAll(() => dbmss.teardown());

    afterEach(() => jest.restoreAllMocks());

    test('with no version', async () => {
        await expect(account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, '')).rejects.toThrow(
            new InvalidArgumentError('Version must be specified'),
        );
    });

    test('with invalid version', async () => {
        await expect(
            account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, 'notAVersionUrlOrFilePath'),
        ).rejects.toThrow(new InvalidArgumentError('Provided version argument is not valid semver, url or path.'));
    });

    test('with valid version (URL)', async () => {
        await expect(
            account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, 'https://valid.url.com'),
        ).rejects.toThrow(new NotSupportedError('fetch and install https://valid.url.com'));
    });

    test('with not existing version (file path)', async () => {
        const message = 'Provided version argument is not valid semver, url or path.';

        await expect(
            account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, path.join('non', 'existing', 'path')),
        ).rejects.toThrow(new InvalidArgumentError(message));

        await expect(
            account.installDbms(
                dbmss.createName(),
                TestDbmss.DBMS_CREDENTIALS,
                path.join('non', 'existing', 'path', '4.0'),
            ),
        ).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('with valid version (file path)', async () => {
        const archive = `neo4j-enterprise-${TEST_NEO4J_VERSION}${
            process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'
        }`;
        const archivePath = path.join(DISTRIBUTIONS_ROOT, archive);

        const dbmsID = await account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, archivePath);
        expect(dbmsID).toMatch(UUID_REGEX);

        const message = await account.statusDbmss([dbmsID]);
        expect(message[0]).toContain('Neo4j is not running');

        const info = await getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsID}`));
        expect(info?.version).toEqual(TEST_NEO4J_VERSION);
    });

    test('with version in unsupported range (semver)', async () => {
        await expect(account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, '3.1')).rejects.toThrow(
            new NotSupportedError('version not in range >=4.x'),
        );
    });

    test('with valid, non cached version (semver)', async () => {
        // initially mock appearance of no downloaded neo4j dists
        const discoverNeo4jDistributionsSpy = jest
            .spyOn(dbmsVersions, 'discoverNeo4jDistributions')
            .mockImplementationOnce(() => Promise.resolve([]));
        jest.spyOn(downloadNeo4j, 'downloadNeo4j').mockImplementation(() => Promise.resolve());

        const dbmsId = await account.installDbms(dbmss.createName(), 'password', TEST_NEO4J_VERSION);

        expect(discoverNeo4jDistributionsSpy).toHaveBeenCalledTimes(2);

        const message = await account.statusDbmss([dbmsId]);
        expect(message[0]).toContain('Neo4j is not running');

        const info = await getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsId}`));
        expect(info?.version).toEqual(TEST_NEO4J_VERSION);
    });

    test('with invalid, non cached version (semver)', async () => {
        const message = `Unable to find the requested version: ${TEST_NEO4J_VERSION} online`;
        jest.spyOn(dbmsVersions, 'discoverNeo4jDistributions').mockImplementation(() => Promise.resolve([]));
        jest.spyOn(downloadNeo4j, 'downloadNeo4j').mockImplementation(() => Promise.resolve());

        await expect(account.installDbms(dbmss.createName(), 'password', TEST_NEO4J_VERSION)).rejects.toThrow(
            new NotFoundError(message),
        );
    });

    test('with valid version (semver)', async () => {
        const dbmsId = await account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, TEST_NEO4J_VERSION);

        const message = await account.statusDbmss([dbmsId]);
        expect(message[0]).toContain('Neo4j is not running');

        const info = await getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsId}`));
        expect(info?.version).toEqual(TEST_NEO4J_VERSION);

        const dbmsId2 = await account.installDbms(dbmss.createName(), TestDbmss.DBMS_CREDENTIALS, TEST_NEO4J_VERSION);

        const message2 = await account.statusDbmss([dbmsId2]);
        expect(message2[0]).toContain('Neo4j is not running');

        const info2 = await getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsId2}`));
        expect(info2?.version).toEqual(TEST_NEO4J_VERSION);
    });
});
