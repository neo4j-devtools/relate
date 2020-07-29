import fse from 'fs-extra';
import path from 'path';
import {List} from '@relate/types';

import {TestDbmss} from '../../utils/system';
import {EnvironmentAbstract} from '../environments';
import {IRelateBackup} from '../../models';
import {envPaths} from '../../utils';
import {BACKUPS_DIR_NAME, ENTITY_TYPES} from '../../constants';

describe('LocalBackups', () => {
    let environment: EnvironmentAbstract;
    let testDbmss: TestDbmss;
    let dbmsId: string;
    let backupId: string;
    let backupId2: string;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        environment = testDbmss.environment;

        const {id} = await testDbmss.createDbms();
        dbmsId = id;
    });

    afterAll(async () => {
        await testDbmss.teardown();
        await fse.emptyDir(path.join(envPaths().data, BACKUPS_DIR_NAME));
    });

    test('backups.list() - none created', async () => {
        expect(await environment.backups.list()).toEqual(List.from());
    });

    test('backups.create()', async () => {
        const created = await environment.backups.create(ENTITY_TYPES.DBMS, dbmsId);
        backupId = created.id;

        const expected: IRelateBackup = {
            id: backupId,
            directory: path.join(envPaths().data, BACKUPS_DIR_NAME, `${ENTITY_TYPES.BACKUP}-${backupId}`),
            name: expect.stringContaining(`${ENTITY_TYPES.BACKUP}_${backupId}_${ENTITY_TYPES.DBMS}_${dbmsId}_`),
            entityMeta: {},
            entityType: ENTITY_TYPES.DBMS,
            entityId: dbmsId,
            created: expect.any(Date),
        };

        expect(created).toEqual(expected);
    });

    test('backups.list() - one created', async () => {
        const expected: List<IRelateBackup> = List.from([
            {
                id: backupId,
                directory: path.join(envPaths().data, BACKUPS_DIR_NAME, `${ENTITY_TYPES.BACKUP}-${backupId}`),
                name: expect.stringContaining(`${ENTITY_TYPES.BACKUP}_${backupId}_${ENTITY_TYPES.DBMS}_${dbmsId}_`),
                entityMeta: {},
                entityType: ENTITY_TYPES.DBMS,
                entityId: dbmsId,
                created: expect.any(Date),
            },
        ]);

        expect(await environment.backups.list()).toEqual(expected);
    });

    test('backups.create() - again', async () => {
        const created = await environment.backups.create(ENTITY_TYPES.DBMS, dbmsId, {foo: 'bar'});
        backupId2 = created.id;
        const expected: IRelateBackup = {
            id: backupId2,
            directory: path.join(envPaths().data, BACKUPS_DIR_NAME, `${ENTITY_TYPES.BACKUP}-${backupId2}`),
            name: expect.stringContaining(`${ENTITY_TYPES.BACKUP}_${backupId2}_${ENTITY_TYPES.DBMS}_${dbmsId}_`),
            entityMeta: {foo: 'bar'},
            entityType: ENTITY_TYPES.DBMS,
            entityId: dbmsId,
            created: expect.any(Date),
        };

        expect(created).toEqual(expected);
    });

    test('backups.list() - two created', async () => {
        const result = await environment.backups.list();

        expect(result.mapEach(({id}) => id).sort()).toEqual(List.from([backupId, backupId2]).sort());
    });

    test('backups.remove()', async () => {
        const {id} = await environment.backups.remove(backupId2);

        expect(id).toEqual(backupId2);
    });

    test('backups.list() - one removed', async () => {
        const result = await environment.backups.list();

        expect(result.mapEach(({id}) => id)).toEqual(List.from([backupId]));
    });

    test('backups.restore() - directory', async () => {
        const toRestore = await environment.backups.get(backupId);
        const {entityId} = await environment.backups.restore(toRestore.directory);
        const dbmsAfter = await environment.dbmss.get(entityId);

        expect(dbmsAfter.id).toEqual(entityId);

        await environment.dbmss.uninstall(entityId);
    });

    test('backups.restore() - file', async () => {
        const toRestore = await environment.backups.get(backupId);
        const {entityId} = await environment.backups.restore(path.join(toRestore.directory, toRestore.name));
        const dbmsAfter = await environment.dbmss.get(entityId);

        expect(dbmsAfter.id).toEqual(entityId);

        await environment.dbmss.uninstall(entityId);
    });
});
