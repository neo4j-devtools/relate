import {v4 as uuid} from 'uuid';
import fse from 'fs-extra';
import path from 'path';

import {DbmsManifestModel, IDbmsInfo} from '../../models';
import {TestEnvironment} from '../../utils/system';

describe('LocalDbmss - manifest', () => {
    const nonExistentId = uuid();
    let app: TestEnvironment;
    let dbms: IDbmsInfo;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
        dbms = await app.createDbms();
    });

    afterAll(async () => {
        await fse.remove(path.join(app.environment.dirPaths.dbmssData, `dbms-${nonExistentId}`));
        await app.teardown();
    });

    test('get manifest of existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: '',
            tags: [],
        });
        const manifest = await app.environment.dbmss.manifest.get(dbms.id);

        expect(manifest).toEqual(expected);
    });

    test('update manifest of existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: [],
        });

        await app.environment.dbmss.manifest.update(dbms.id, {
            description: 'some description',
        });
        const manifest = await app.environment.dbmss.manifest.get(dbms.id);

        expect(manifest).toEqual(expected);
    });

    test('add tags to existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: ['tag1', 'tag2', 'tag3'],
        });

        const newDbms = await app.environment.dbmss.manifest.addTags(dbms.id, ['tag1', 'tag2', 'tag3']);
        const manifest = await app.environment.dbmss.manifest.get(dbms.id);

        expect(newDbms.tags).toEqual(expected.tags);
        expect(manifest).toEqual(expected);
    });

    test('remove tags from existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: ['tag1', 'tag3'],
        });

        const newDbms = await app.environment.dbmss.manifest.removeTags(dbms.id, ['tag2']);
        const manifest = await app.environment.dbmss.manifest.get(dbms.id);

        expect(newDbms.tags).toEqual(expected.tags);
        expect(manifest).toEqual(expected);
    });

    test('add metadata to existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: ['tag1', 'tag3'],
            metadata: {
                object: {
                    foo: 'bar',
                },
                number: 42,
                string: 'foo',
            },
        });

        await app.environment.dbmss.manifest.setMetadata(dbms.id, 'object', {foo: 'bar'});
        await app.environment.dbmss.manifest.setMetadata(dbms.id, 'number', 42);
        const updatedDbms = await app.environment.dbmss.manifest.setMetadata(dbms.id, 'string', 'foo');
        const manifest = await app.environment.dbmss.manifest.get(dbms.id);

        expect(updatedDbms.metadata).toEqual(expected.metadata);
        expect(manifest).toEqual(expected);
    });

    test('remove metadata from existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: ['tag1', 'tag3'],
            metadata: {string: 'foo'},
        });

        const updatedDbms = await app.environment.dbmss.manifest.removeMetadata(
            dbms.id,
            'object',
            'number',
            'nonexistent',
        );
        const manifest = await app.environment.dbmss.manifest.get(dbms.id);

        expect(updatedDbms.metadata).toEqual(expected.metadata);
        expect(manifest).toEqual(expected);
    });

    test('update manifest of non existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: nonExistentId,
            name: 'a new dbms',
            description: 'with a new description',
            tags: [],
        });

        await app.environment.dbmss.manifest.update(nonExistentId, {
            name: 'a new dbms',
            description: 'with a new description',
        });
        const manifest = await app.environment.dbmss.manifest.get(nonExistentId);

        expect(manifest).toEqual(expected);
    });
});
