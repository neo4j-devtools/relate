import {List, Str} from '@relate/types';
import fse from 'fs-extra';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import zipAFolder from 'zip-a-folder';
import decompress from 'decompress';

import {LocalEnvironment} from '../environments';
import {IRelateBackup, RelateBackupModel} from '../../models';
import {
    BACKUP_MANIFEST_FILE,
    DBMS_MANIFEST_FILE,
    ENTITY_TYPES,
    EXTENSION_MANIFEST_FILE,
    PROJECT_MANIFEST_FILE,
} from '../../constants';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {BackupAbstract} from './backup.abstract';
import {InvalidArgumentError, RelateBackupError, ValidationFailureError} from '../../errors';

const BACKUP_FILE_EXTENSION = '.gzip';

export class LocalBackups extends BackupAbstract<LocalEnvironment> {
    async create(entityType: ENTITY_TYPES, entityNameOrId: string, entityMeta: any = {}): Promise<IRelateBackup> {
        const entityRoot = this.environment.getEntityRootPath(entityType, entityNameOrId);
        const exists = await fse.pathExists(entityRoot);

        if (!exists) {
            throw new InvalidArgumentError(`Could not resolve entity [${entityType}] ${entityNameOrId}`);
        }

        const backupId = uuidv4();
        const createdAt = new Date();
        const backupDir = this.environment.getEntityRootPath(ENTITY_TYPES.BACKUP, backupId);
        const backupName = `${
            ENTITY_TYPES.BACKUP
        }_${backupId}_${entityType}_${entityNameOrId}_${createdAt.getTime()}${BACKUP_FILE_EXTENSION}`;
        const backupTarget = path.join(backupDir, backupName);

        try {
            await fse.ensureDir(backupDir);
            await zipAFolder.zip(entityRoot, backupTarget);

            return this.setBackupManifest(backupId, {
                directory: backupDir,
                name: backupName,
                entityType,
                entityId: entityNameOrId,
                entityMeta,
                created: createdAt,
            });
        } catch (e) {
            await fse.remove(backupTarget).catch(() => null);
            await this.removeBackupManifest(backupId).catch(() => null);

            throw new RelateBackupError('Failed to create backup', List.from([e.stack]));
        }
    }

    async restore(filePath: string, outputPath?: string): Promise<IRelateBackup> {
        const restoreId = uuidv4();
        const manifest = await this.resolveRestorationManifest(filePath);
        const backupPath = path.join(manifest.directory, manifest.name);

        if (outputPath) {
            await decompress(backupPath, outputPath);
            await fse.writeJSON(path.join(outputPath, BACKUP_MANIFEST_FILE), manifest);

            const restoredManifestPath = path.join(outputPath, this.getRestoredEntityManifestPath(manifest.entityType));
            const restoredManifest = await fse.readJSON(restoredManifestPath);

            await fse.writeJSON(restoredManifestPath, {
                ...restoredManifest,
                id: restoreId,
            });

            return manifest;
        }

        const defaultOutputPath = this.environment.getEntityRootPath(manifest.entityType, restoreId);

        await decompress(backupPath, defaultOutputPath);
        await fse.writeJSON(path.join(defaultOutputPath, BACKUP_MANIFEST_FILE), manifest);

        const restoredManifestPath = path.join(
            defaultOutputPath,
            this.getRestoredEntityManifestPath(manifest.entityType),
        );
        const restoredManifest = await fse.readJSON(restoredManifestPath);

        await fse.writeJSON(restoredManifestPath, {
            ...restoredManifest,
            id: restoreId,
        });

        return manifest;
    }

    async get(backupNameOrId: string): Promise<IRelateBackup> {
        const found = await this.list([
            {
                field: 'id',
                value: backupNameOrId,
            },
        ]);

        return found.first.getOrElse(() => {
            throw new InvalidArgumentError(`Backup ${backupNameOrId} not found`);
        });
    }

    async remove(backupNameOrId: string): Promise<IRelateBackup> {
        const toRemove = await this.get(backupNameOrId);

        await fse.remove(this.environment.getEntityRootPath(ENTITY_TYPES.BACKUP, toRemove.id));

        return toRemove;
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateBackup>> {
        const backups = await List.from(await fse.readdir(this.environment.dirPaths.backupsData))
            .filter((file) => file.startsWith(`${ENTITY_TYPES.BACKUP}-`))
            .mapEach((file) => {
                return this.readManifestFile(
                    path.join(this.environment.dirPaths.backupsData, file, BACKUP_MANIFEST_FILE),
                ).catch(() => null);
            })
            .unwindPromises();

        return applyEntityFilters(backups.compact(), filters);
    }

    private getRestoredEntityManifestPath(entityType: ENTITY_TYPES): string {
        switch (entityType) {
            case ENTITY_TYPES.DBMS:
                return DBMS_MANIFEST_FILE;

            case ENTITY_TYPES.PROJECT:
                return PROJECT_MANIFEST_FILE;

            case ENTITY_TYPES.EXTENSION:
                return EXTENSION_MANIFEST_FILE;

            default:
                throw new InvalidArgumentError(`Entity type ${entityType} does not have a manifest file`);
        }
    }

    private async resolveRestorationManifest(filePath: string): Promise<IRelateBackup> {
        const stats = await fse.stat(filePath);
        const dirName = stats.isDirectory() ? filePath : path.dirname(filePath);
        const manifestPath = path.join(dirName, BACKUP_MANIFEST_FILE);

        try {
            return this.readManifestFile(manifestPath);
        } catch (e) {
            const fileName = path.basename(filePath);
            const parts = Str.from(path.basename(filePath, BACKUP_FILE_EXTENSION))
                .split('_')
                .mapEach((s) => s.get());
            const [, backupId, entityType, entityNameOrId, createdAt] = parts;

            return new RelateBackupModel({
                directory: dirName,
                name: fileName,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                entityType,
                entityId: entityNameOrId,
                entityMeta: {},
                created: new Date(Number(createdAt)),
                id: backupId,
            });
        }
    }

    private getBackupManifest(backupId: string): Promise<IRelateBackup> {
        const configFileName = path.join(
            this.environment.getEntityRootPath(ENTITY_TYPES.BACKUP, backupId),
            BACKUP_MANIFEST_FILE,
        );

        return this.readManifestFile(configFileName);
    }

    private async readManifestFile(filePath: string): Promise<IRelateBackup> {
        try {
            const config = await fse.readJson(filePath);

            return new RelateBackupModel({
                ...config,
                created: new Date(config.created),
            });
        } catch (e) {
            if (e instanceof ValidationFailureError) {
                throw e;
            }

            throw new InvalidArgumentError(`Unable to parse backup manifest ${filePath}`);
        }
    }

    private async setBackupManifest(
        backupId: string,
        update: Partial<Omit<IRelateBackup, 'id'>>,
    ): Promise<IRelateBackup> {
        const configFileName = path.join(
            this.environment.getEntityRootPath(ENTITY_TYPES.BACKUP, backupId),
            BACKUP_MANIFEST_FILE,
        );
        const manifest = await this.readManifestFile(configFileName).catch(() => ({}));
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const withUpdates = new RelateBackupModel({
            ...manifest,
            ...update,
            id: backupId,
        });

        await fse.writeJSON(configFileName, withUpdates);

        return this.getBackupManifest(backupId);
    }

    private async removeBackupManifest(backupId: string): Promise<void> {
        const configFileName = path.join(
            this.environment.getEntityRootPath(ENTITY_TYPES.BACKUP, backupId),
            BACKUP_MANIFEST_FILE,
        );

        await fse.remove(configFileName);
    }
}
