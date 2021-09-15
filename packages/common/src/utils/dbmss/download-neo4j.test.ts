import fse from 'fs-extra';
import path from 'path';
import nock from 'nock';
import * as uuid from 'uuid';
import {List} from '@relate/types';
import {inc} from 'semver';

import * as downloadNeo4j from './download-neo4j';
import * as dbmsVersions from './dbms-versions';
import * as download from '../download';
import * as extractNeo4j from './extract-neo4j';

import {TestDbmss} from '../system';
import {envPaths} from '../env-paths';
import {NEO4J_EDITION, NEO4J_ORIGIN, NEO4J_SHA_ALGORITHM} from '../../entities/environments';
import {DBMS_DIR_NAME, DOWNLOADING_FILE_EXTENSION} from '../../constants';
import {NotFoundError, FetchError, IntegrityError} from '../../errors';
import {IDbmsVersion} from '../../models';

jest.mock('uuid');

const TEST_DIST = 'https://dist.neo4j.org';
const TMP_NEO4J_DIST_PATH = path.join(envPaths().cache, DBMS_DIR_NAME);
const TMP_UUID = 'tmp_uuid';
const TMP_FILE_CONTENTS = 'test file contents';
const TMP_PATH = path.join(TMP_NEO4J_DIST_PATH, `Unconfirmed_${TMP_UUID}${DOWNLOADING_FILE_EXTENSION}`);
const EXPECTED_HASH_VALUE = 'test_hash1234';
const DBMS_VERSION = {
    dist: TEST_DIST,
    edition: NEO4J_EDITION.ENTERPRISE,
    origin: NEO4J_ORIGIN.ONLINE,
    version: TestDbmss.NEO4J_VERSION,
};

describe('Download Neo4j (to local cache)', () => {
    beforeEach(() => fse.ensureDir(TMP_NEO4J_DIST_PATH));

    afterEach(() => jest.restoreAllMocks());

    test('downloadNeo4j: successfully download and extract neo4j', async () => {
        // setup spies
        const getCheckSumSpy = jest
            .spyOn(downloadNeo4j, 'getCheckSum')
            .mockImplementation(() => Promise.resolve(EXPECTED_HASH_VALUE));

        const downloadSpy = jest.spyOn(download, 'download').mockImplementation(() => {
            fse.ensureFile(TMP_PATH);
            return Promise.resolve(TMP_PATH);
        });

        const verifyHashSpy = jest.spyOn(download, 'verifyHash').mockImplementation(() => Promise.resolve());

        const extractFromArchiveSpy = jest.spyOn(extractNeo4j, 'extractNeo4j').mockImplementation(() =>
            Promise.resolve({
                ...DBMS_VERSION,
                extractedDistPath: path.join(
                    TMP_NEO4J_DIST_PATH,
                    `neo4j-${NEO4J_EDITION.ENTERPRISE}-${TestDbmss.NEO4J_VERSION}`,
                ),
            }),
        );

        const removeSpy = jest.spyOn(fse, 'remove');

        jest.spyOn(uuid, 'v4').mockImplementation(() => TMP_UUID);
        jest.spyOn(dbmsVersions, 'fetchNeo4jVersions').mockImplementation(() =>
            Promise.resolve(List.from([DBMS_VERSION])),
        );

        // call downloadNeo4j
        await downloadNeo4j.downloadNeo4j(TestDbmss.NEO4J_VERSION, TestDbmss.NEO4J_EDITION, TMP_NEO4J_DIST_PATH);

        // tests
        expect(getCheckSumSpy).toHaveBeenCalledWith(`${DBMS_VERSION.dist}.${NEO4J_SHA_ALGORITHM}`);
        expect(downloadSpy).toHaveBeenCalledWith(`${DBMS_VERSION.dist}`, TMP_NEO4J_DIST_PATH);
        expect(verifyHashSpy).toHaveBeenCalledWith(EXPECTED_HASH_VALUE, TMP_PATH);
        expect(extractFromArchiveSpy).toHaveBeenCalledWith(TMP_PATH, TMP_NEO4J_DIST_PATH);
        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(removeSpy).toHaveBeenCalledWith(TMP_PATH);
    });

    test('downloadNeo4j: no requested distributions found online', async () => {
        // eslint-disable-next-line max-len
        let message = `Unable to find the requested version: ${TestDbmss.NEO4J_VERSION}-${TestDbmss.NEO4J_EDITION} online.\n\nSuggested Action(s):\n- Use a valid version`;
        let dbmsVersion: IDbmsVersion[] = [];

        jest.spyOn(dbmsVersions, 'fetchNeo4jVersions').mockImplementation(() =>
            Promise.resolve(List.from(dbmsVersion)),
        );

        await expect(
            downloadNeo4j.downloadNeo4j(TestDbmss.NEO4J_VERSION, TestDbmss.NEO4J_EDITION, TMP_NEO4J_DIST_PATH),
        ).rejects.toThrow(new NotFoundError(message));

        const majorVersionIncrement = inc(TestDbmss.NEO4J_VERSION, 'major');
        dbmsVersion = [
            {
                ...DBMS_VERSION,
                version: majorVersionIncrement!,
            },
        ];

        // eslint-disable-next-line max-len
        message = `Unable to find the requested version: ${TestDbmss.NEO4J_VERSION}-${TestDbmss.NEO4J_EDITION} online.\n\nSuggested Action(s):\n- Use a valid version found online: ${majorVersionIncrement}-${TestDbmss.NEO4J_EDITION}`;

        await expect(
            downloadNeo4j.downloadNeo4j(TestDbmss.NEO4J_VERSION, TestDbmss.NEO4J_EDITION, TMP_NEO4J_DIST_PATH),
        ).rejects.toThrow(new NotFoundError(message));
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
            const hash = await download.sha256(TMP_PATH);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(await download.verifyHash(hash!, TMP_PATH)).toBe(undefined);
        });

        test('hash mismatch', async () => {
            await expect(download.verifyHash(EXPECTED_HASH_VALUE, TMP_PATH)).rejects.toThrow(
                new IntegrityError('Expected hash mismatch'),
            );
        });
    });
});
