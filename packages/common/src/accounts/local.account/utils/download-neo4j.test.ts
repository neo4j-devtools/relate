import fse from 'fs-extra';
import path from 'path';
// import got from 'got'
// import {PassThrough} from 'stream';
// import * as stream from 'stream'
import * as uuid from 'uuid';
jest.mock('uuid', () => ({
    v4: jest.fn()
}));

import * as downloadNeo4j from './download-neo4j';
import * as dbmsVersions from './dbms-versions';
import * as extractNeo4j from './extract-neo4j';

import {envPaths} from '../../../utils';
import {NEO4J_EDITION, NEO4J_ORIGIN} from '../../account.constants';

// jest.mock('fse');
// jest.mock('stream')

const TMP_NEO4J_DIST_PATH = path.join(envPaths().tmp, 'neo4j_dist');


describe('Download Neo4j (to local cache)', () => {
    beforeEach(() => fse.ensureDir(TMP_NEO4J_DIST_PATH));

    afterEach(() => fse.remove(TMP_NEO4J_DIST_PATH));

    test('initial', async () => {
        jest.spyOn(dbmsVersions, 'fetchNeo4jVersions').mockResolvedValue([
            {
                edition: NEO4J_EDITION.ENTERPRISE,
                version: '4.0.4',
                dist: `http://dist.neo4j.org/example`,
                origin: NEO4J_ORIGIN.ONLINE,
            }
        ]);
        jest.spyOn(downloadNeo4j, 'getCheckSum').mockResolvedValue('12345678');
        // const mockWriteable = new stream.PassThrough();
        // const mockReadable = new stream.PassThrough();

        // jest.spyOn(got, 'stream').mockReturnValue(mockReadable);
        // jest.spyOn(stream, 'pipeline').mockReturnValue(mockReadable);
        // jest.spyOn(stream, 'pipeline').mockImplementation((_, mockWriteable) => {
        //     return mockWriteable
        // });
        jest.spyOn(downloadNeo4j, 'verifyHash').mockResolvedValue('123');
        jest.spyOn(uuid, 'v4').mockReturnValue('12345')
        jest.spyOn(downloadNeo4j, 'pipeline').mockImplementation(async () => {
            await fse.ensureFile(path.join(path.join(TMP_NEO4J_DIST_PATH, '12345')))
        });
        jest.spyOn(extractNeo4j, 'extractFromArchive').mockResolvedValue('123');
        

        const spy = jest.spyOn(fse, 'remove')

        const promise = await downloadNeo4j.downloadNeo4j('4.0.4', TMP_NEO4J_DIST_PATH);
        // setTimeout(() => {
        //     mockReadable.emit('end', 'finish')
        //   }, 100)
        expect(spy).toHaveBeenCalledTimes(3);
        expect(promise).resolves.toBe('finish');
        // expect(spy).toHaveBeenLastCalledWith(1);
    })
});
