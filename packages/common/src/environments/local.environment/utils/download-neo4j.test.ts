import fse from 'fs-extra';
import path from 'path';
import nock from 'nock';
import hasha from 'hasha';
import * as uuid from 'uuid';

import * as downloadNeo4j from './download-neo4j';
import * as dbmsVersions from './dbms-versions';
import * as systemUtils from '../../../utils';

import {NEO4J_EDITION, NEO4J_ORIGIN, NEO4J_SHA_ALGORITHM} from '../../environment.constants';
import {DBMS_DIR_NAME, DOWNLOADING_FILE_EXTENSION} from '../../../constants';
import {NotFoundError, FetchError, IntegrityError} from '../../../errors';

jest.mock('uuid');

const TEST_VERSION = process.env.TEST_NEO4j_VERSION || '4.0.4';
const TEST_DIST = 'http://dist.neo4j.org';
const TMP_NEO4J_DIST_PATH = path.join(systemUtils.envPaths().cache, DBMS_DIR_NAME);
const TMP_UUID = 'tmp_uuid';
const TMP_FILE_CONTENTS = 'test file contents';
const TMP_PATH = path.join(TMP_NEO4J_DIST_PATH, `${TMP_UUID}${DOWNLOADING_FILE_EXTENSION}`);
const EXPECTED_HASH_VALUE = 'test_hash1234';
const DBMS_VERSION = {
    dist: TEST_DIST,
    edition: NEO4J_EDITION.ENTERPRISE,
    version: TEST_VERSION,
    origin: NEO4J_ORIGIN.ONLINE,
};

describe('Download Neo4j (to local cache)', () => {
    beforeEach(() => fse.ensureDir(TMP_NEO4J_DIST_PATH));

    afterEach(() => jest.restoreAllMocks());

    test('downloadNeo4j: successfully download and extract neo4j', async () => {
        // setup spies
        const getCheckSumSpy = jest
            .spyOn(downloadNeo4j, 'getCheckSum')
            .mockImplementation(() => Promise.resolve(EXPECTED_HASH_VALUE));

        const pipelineSpy = jest.spyOn(downloadNeo4j, 'pipeline').mockImplementation(() => fse.ensureFile(TMP_PATH));

        const verifyHashSpy = jest
            .spyOn(downloadNeo4j, 'verifyHash')
            .mockImplementation(() => Promise.resolve(EXPECTED_HASH_VALUE));

        const extractFromArchiveSpy = jest.spyOn(systemUtils, 'extractNeo4j').mockImplementation(() =>
            Promise.resolve({
                ...DBMS_VERSION,
                extractedDistPath: path.join(TMP_NEO4J_DIST_PATH, `neo4j-${NEO4J_EDITION.ENTERPRISE}-${TEST_VERSION}`),
            }),
        );

        const removeSpy = jest.spyOn(fse, 'remove');

        jest.spyOn(uuid, 'v4').mockImplementation(() => TMP_UUID);
        jest.spyOn(dbmsVersions, 'fetchNeo4jVersions').mockImplementation(() => Promise.resolve([DBMS_VERSION]));

        // call downloadNeo4j
        await downloadNeo4j.downloadNeo4j(TEST_VERSION, TMP_NEO4J_DIST_PATH);

        // tests
        expect(getCheckSumSpy).toHaveBeenCalledWith(`${DBMS_VERSION.dist}.${NEO4J_SHA_ALGORITHM}`);
        expect(pipelineSpy).toHaveBeenCalledWith(`${DBMS_VERSION.dist}`, TMP_PATH);
        expect(verifyHashSpy).toHaveBeenCalledWith(EXPECTED_HASH_VALUE, TMP_PATH);
        expect(extractFromArchiveSpy).toHaveBeenCalledWith(TMP_PATH, TMP_NEO4J_DIST_PATH);
        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(removeSpy).toHaveBeenCalledWith(TMP_PATH);
    });

    test('downloadNeo4j: no requested distributions found online', async () => {
        const message = `Unable to find the requested version: ${TEST_VERSION} online`;

        const dbmsVersion = {
            ...DBMS_VERSION,
            edition: NEO4J_EDITION.COMMUNITY,
        };

        jest.spyOn(dbmsVersions, 'fetchNeo4jVersions').mockImplementation(() => Promise.resolve([dbmsVersion]));

        await expect(downloadNeo4j.downloadNeo4j(TEST_VERSION, TMP_NEO4J_DIST_PATH)).rejects.toThrow(
            new NotFoundError(message),
        );
    });

    test('getCheckSum: valid response from sha URL', async () => {
        nock(`${DBMS_VERSION.dist}.${NEO4J_SHA_ALGORITHM}`)
            .get('/')
            .reply(200, EXPECTED_HASH_VALUE);

        expect(await downloadNeo4j.getCheckSum(`${DBMS_VERSION.dist}.${NEO4J_SHA_ALGORITHM}`)).toBe(
            EXPECTED_HASH_VALUE,
        );
    });

    test('getCheckSum: invalid response from sha URL', async () => {
        nock(`${DBMS_VERSION.dist}.${NEO4J_SHA_ALGORITHM}`)
            .get('/')
            .replyWithError('something bad happened');

        await expect(downloadNeo4j.getCheckSum(`${DBMS_VERSION.dist}.${NEO4J_SHA_ALGORITHM}`)).rejects.toThrow(
            new FetchError('RequestError: something bad happened'),
        );
    });

    describe('verifyHash', () => {
        beforeAll(() => fse.writeFile(TMP_PATH, TMP_FILE_CONTENTS));

        afterAll(() => fse.remove(TMP_PATH));

        test('hash match', async () => {
            const hash = await hasha.fromFile(TMP_PATH, {algorithm: NEO4J_SHA_ALGORITHM});
            expect(await downloadNeo4j.verifyHash(hash!, TMP_PATH)).toBe(hash);
        });

        test('hash mismatch', async () => {
            await expect(downloadNeo4j.verifyHash(EXPECTED_HASH_VALUE, TMP_PATH)).rejects.toThrow(
                new IntegrityError('Expected hash mismatch'),
            );
        });
    });
});
