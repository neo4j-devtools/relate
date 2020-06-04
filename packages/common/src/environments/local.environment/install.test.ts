import path from 'path';

import {ENVIRONMENT_TYPES} from '../environment.constants';
import {EnvironmentConfigModel} from '../../models';
import {envPaths} from '../../utils';
import {InvalidArgumentError, NotSupportedError, NotFoundError} from '../../errors';
import {LocalEnvironment} from './local.environment';
import * as localUtils from '../../utils/environment';
import {DBMS_DIR_NAME, DBMS_STATUS} from '../../constants';
import {List} from '@relate/types';

const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const DATA_HOME = envPaths().data;
const INSTALL_ROOT = path.join(envPaths().data, DBMS_DIR_NAME);
const DISTRIBUTIONS_ROOT = path.join(envPaths().cache, DBMS_DIR_NAME);
const {DBMS_CREDENTIALS, NEO4J_VERSION} = localUtils.TestDbmss;

describe('LocalEnvironment - install', () => {
    let environment: LocalEnvironment;
    let dbmss: localUtils.TestDbmss;

    beforeAll(async () => {
        const config = new EnvironmentConfigModel({
            dbmss: {},
            id: 'test',
            neo4jDataPath: DATA_HOME,
            type: ENVIRONMENT_TYPES.LOCAL,
            user: 'test',
        });

        await localUtils.downloadNeo4j(NEO4J_VERSION, path.join(envPaths().cache, DBMS_DIR_NAME));

        environment = new LocalEnvironment(config, 'nowhere');
        dbmss = new localUtils.TestDbmss(__filename, environment);
    });

    afterAll(() => dbmss.teardown());

    afterEach(() => jest.restoreAllMocks());

    test('with no version', async () => {
        await expect(environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, '')).rejects.toThrow(
            new InvalidArgumentError('Version must be specified'),
        );
    });

    test('with invalid version', async () => {
        await expect(
            environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, 'notAVersionUrlOrFilePath'),
        ).rejects.toThrow(new InvalidArgumentError('Provided version argument is not valid semver, url or path.'));
    });

    test('with valid version (URL)', async () => {
        await expect(
            environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, 'https://valid.url.com'),
        ).rejects.toThrow(new NotSupportedError('fetch and install https://valid.url.com'));
    });

    test('with not existing version (file path)', async () => {
        const message = 'Provided version argument is not valid semver, url or path.';

        await expect(
            environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, path.join('non', 'existing', 'path')),
        ).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('with valid version (file path)', async () => {
        const archive = `neo4j-enterprise-${NEO4J_VERSION}${
            process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'
        }`;
        const archivePath = path.join(DISTRIBUTIONS_ROOT, archive);

        const dbmsID = await environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, archivePath);
        expect(dbmsID).toMatch(UUID_REGEX);

        const message = (await environment.infoDbmss([dbmsID])).toArray();
        expect(message[0].status).toContain(DBMS_STATUS.STOPPED);

        const info = await localUtils.getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsID}`));
        expect(info?.version).toEqual(NEO4J_VERSION);
    });

    test('with version in unsupported range (semver)', async () => {
        await expect(environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, '3.1')).rejects.toThrow(
            new NotSupportedError('version not in range >=4.x'),
        );
    });

    test('with valid, non cached version (semver)', async () => {
        // initially mock appearance of no downloaded neo4j dists
        const discoverNeo4jDistributionsSpy = jest
            .spyOn(localUtils, 'discoverNeo4jDistributions')
            .mockImplementationOnce(() => Promise.resolve(List.from([])));
        jest.spyOn(localUtils, 'downloadNeo4j').mockImplementation(() => Promise.resolve());

        const dbmsId = await environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, NEO4J_VERSION);

        expect(discoverNeo4jDistributionsSpy).toHaveBeenCalledTimes(2);

        const message = (await environment.infoDbmss([dbmsId])).toArray();
        expect(message[0].status).toContain(DBMS_STATUS.STOPPED);

        const info = await localUtils.getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsId}`));
        expect(info?.version).toEqual(NEO4J_VERSION);
    });

    test('with invalid, non cached version (semver)', async () => {
        const message = `Unable to find the requested version: ${NEO4J_VERSION} online`;
        jest.spyOn(localUtils, 'discoverNeo4jDistributions').mockImplementation(() => Promise.resolve(List.from([])));
        jest.spyOn(localUtils, 'downloadNeo4j').mockImplementation(() => Promise.resolve());

        await expect(environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, NEO4J_VERSION)).rejects.toThrow(
            new NotFoundError(message),
        );
    });

    test('with valid version (semver)', async () => {
        const dbmsId = await environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, NEO4J_VERSION);

        const message = (await environment.infoDbmss([dbmsId])).toArray();
        expect(message[0].status).toContain(DBMS_STATUS.STOPPED);

        const info = await localUtils.getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsId}`));
        expect(info?.version).toEqual(NEO4J_VERSION);

        const dbmsId2 = await environment.installDbms(dbmss.createName(), DBMS_CREDENTIALS, NEO4J_VERSION);

        const message2 = (await environment.infoDbmss([dbmsId2])).toArray();
        expect(message2[0].status).toContain(DBMS_STATUS.STOPPED);

        const info2 = await localUtils.getDistributionInfo(path.join(INSTALL_ROOT, `dbms-${dbmsId2}`));
        expect(info2?.version).toEqual(NEO4J_VERSION);
    });
});
