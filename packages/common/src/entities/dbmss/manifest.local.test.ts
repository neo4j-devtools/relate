import {v4 as uuid} from 'uuid';
import fse from 'fs-extra';
import path from 'path';

import {DbmsManifestModel, IDbmsInfo} from '../../models';
import {TestDbmss} from '../../utils/system';
import {EnvironmentAbstract} from '../environments';

describe('LocalDbmss - manifest', () => {
    const nonExistentId = uuid();
    let environment: EnvironmentAbstract;
    let testDbmss: TestDbmss;
    let dbms: IDbmsInfo;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        environment = testDbmss.environment;
        dbms = await testDbmss.createDbms();
    });

    afterAll(async () => {
        await fse.remove(path.join(environment.dirPaths.dbmssData, `dbms-${nonExistentId}`));
        await testDbmss.teardown();
    });

    test('get manifest of existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: '',
            tags: [],
        });
        const manifest = await environment.dbmss.manifest.get(dbms.id);

        expect(manifest).toEqual(expected);
    });

    test('update manifest of existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: [],
        });

        await environment.dbmss.manifest.update(dbms.id, {
            description: 'some description',
        });
        const manifest = await environment.dbmss.manifest.get(dbms.id);

        expect(manifest).toEqual(expected);
    });

    test('add tags to existing DBMS', async () => {
        const expected = new DbmsManifestModel({
            id: dbms.id,
            name: dbms.name,
            description: 'some description',
            tags: ['tag1', 'tag2', 'tag3'],
        });

        const newDbms = await environment.dbmss.manifest.addTags(dbms.id, ['tag1', 'tag2', 'tag3']);
        const manifest = await environment.dbmss.manifest.get(dbms.id);

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

        const newDbms = await environment.dbmss.manifest.removeTags(dbms.id, ['tag2']);
        const manifest = await environment.dbmss.manifest.get(dbms.id);

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

        await environment.dbmss.manifest.setMetadata(dbms.id, 'object', {foo: 'bar'});
        await environment.dbmss.manifest.setMetadata(dbms.id, 'number', 42);
        const updatedDbms = await environment.dbmss.manifest.setMetadata(dbms.id, 'string', 'foo');
        const manifest = await environment.dbmss.manifest.get(dbms.id);

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

        const updatedDbms = await environment.dbmss.manifest.removeMetadata(dbms.id, 'object', 'number', 'nonexistent');
        const manifest = await environment.dbmss.manifest.get(dbms.id);

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

        await environment.dbmss.manifest.update(nonExistentId, {
            name: 'a new dbms',
            description: 'with a new description',
        });
        const manifest = await environment.dbmss.manifest.get(nonExistentId);

        expect(manifest).toEqual(expected);
    });
});
