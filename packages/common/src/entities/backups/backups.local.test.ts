import path from 'path';
import {List} from '@relate/types';

import {TestDbmss} from '../../utils/system';
import {EnvironmentAbstract} from '../environments';
import {IRelateBackup} from '../../models';
import {envPaths} from '../../utils';
import {BACKUPS_DIR_NAME, ENTITY_TYPES} from '../../constants';
import {InvalidArgumentError} from '../../errors';

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

    afterAll(() => testDbmss.teardown());

    test('backups.list() - none created', async () => {
        const backups = await environment.backups.list();

        expect(backups.filter(({id}) => [backupId, backupId2].includes(id))).toEqual(List.from());
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

    test('backups.get() - one created', async () => {
        const expected: IRelateBackup = {
            id: backupId,
            directory: path.join(envPaths().data, BACKUPS_DIR_NAME, `${ENTITY_TYPES.BACKUP}-${backupId}`),
            name: expect.stringContaining(`${ENTITY_TYPES.BACKUP}_${backupId}_${ENTITY_TYPES.DBMS}_${dbmsId}_`),
            entityMeta: {},
            entityType: ENTITY_TYPES.DBMS,
            entityId: dbmsId,
            created: expect.any(Date),
        };

        expect(await environment.backups.get(backupId)).toEqual(expected);
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

    test('backups.get() - two created', async () => {
        const result = await environment.backups.get(backupId2);

        expect(result.id).toEqual(backupId2);
    });

    test('backups.remove()', async () => {
        const {id} = await environment.backups.remove(backupId2);

        expect(id).toEqual(backupId2);
    });

    test('backups.get() - one removed', async () => {
        await expect(environment.backups.get(backupId2)).rejects.toEqual(
            new InvalidArgumentError(`Backup ${backupId2} not found`),
        );
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
