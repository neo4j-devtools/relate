import {List, Str} from '@relate/types';
import fse from 'fs-extra';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import tar from 'tar';

import {LocalEnvironment} from '../environments';
import {IRelateBackup, RelateBackupModel} from '../../models';
import {BACKUP_ARCHIVE_FILE_EXTENSION, BACKUP_MANIFEST_FILE, ENTITY_TYPES} from '../../constants';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {BackupAbstract} from './backup.abstract';
import {InvalidArgumentError, RelateBackupError, ValidationFailureError} from '../../errors';
import {updateRestoredEntityManifest} from '../../utils/backups';
import {envPaths, extract} from '../../utils';
import {getManifestName} from '../../utils/system';

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
        const entityDir = path.dirname(entityRoot);
        const backupName = `${
            ENTITY_TYPES.BACKUP
        }_${backupId}_${entityType}_${entityNameOrId}_${createdAt.getTime()}${BACKUP_ARCHIVE_FILE_EXTENSION}`;
        const archiveTarget = path.join(entityDir, backupName);
        const backupTarget = path.join(backupDir, backupName);

        try {
            await fse.ensureDir(backupDir);
            await tar.c(
                {
                    gzip: true,
                    file: archiveTarget,
                    cwd: entityDir,
                },
                [path.basename(entityRoot)],
            );
            await fse.move(archiveTarget, backupTarget);

            return this.setBackupManifest(backupId, {
                directory: backupDir,
                name: backupName,
                entityType,
                entityId: entityNameOrId,
                entityMeta,
                created: createdAt,
            });
        } catch (e) {
            await fse.remove(archiveTarget).catch(() => null);
            await this.removeBackupManifest(backupId).catch(() => null);

            throw new RelateBackupError('Failed to create backup', List.from([e.stack]));
        }
    }

    async restore(filePath: string, outputPath?: string): Promise<{entityType: ENTITY_TYPES; entityId: string}> {
        const restoredEntityId = uuidv4();
        const manifest = await this.resolveRestorationManifest(filePath);
        const backupPath = path.join(manifest.directory, manifest.name);
        const defaultOutputPath = this.environment.getEntityRootPath(manifest.entityType, restoredEntityId);
        const outputTarget = outputPath || defaultOutputPath;
        const tmpPath = path.join(envPaths().tmp, `relate-restore-${manifest.id}-tmp`);
        const result = await extract(backupPath, tmpPath);

        await fse.move(result, outputTarget);
        await fse.writeJSON(path.join(outputTarget, BACKUP_MANIFEST_FILE), manifest, {encoding: 'utf8'});

        const restoredEntityManifestPath = path.join(outputTarget, getManifestName(manifest.entityType));
        const restoredEntityManifest = await fse.readJSON(restoredEntityManifestPath, {encoding: 'utf-8'});
        const updated = updateRestoredEntityManifest(manifest, restoredEntityId, restoredEntityManifest);

        await fse.writeJSON(restoredEntityManifestPath, updated, {encoding: 'utf8'});

        return {
            entityType: manifest.entityType,
            entityId: updated.id,
        };
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
                return this.resolveRestorationManifest(path.join(this.environment.dirPaths.backupsData, file)).catch(
                    () => null,
                );
            })
            .unwindPromises();

        return applyEntityFilters(backups.compact(), filters);
    }

    private async resolveRestorationManifest(filePath: string): Promise<IRelateBackup> {
        const stats = await fse.stat(filePath);
        const dirName = stats.isDirectory() ? filePath : path.dirname(filePath);
        const manifestPath = path.join(dirName, BACKUP_MANIFEST_FILE);

        try {
            return this.readManifestFile(manifestPath);
        } catch (e) {
            const fileName = path.basename(filePath);
            const parts = Str.from(path.basename(filePath, BACKUP_ARCHIVE_FILE_EXTENSION))
                .split('_')
                .mapEach((s) => s.get());
            const [, backupId, entityType, entityNameOrId, createdAt] = parts;

            return new RelateBackupModel({
                directory: dirName,
                name: fileName,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
            const config = await fse.readJSON(filePath, {encoding: 'utf-8'});

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const withUpdates = new RelateBackupModel({
            ...manifest,
            ...update,
            id: backupId,
        });

        await fse.writeJSON(configFileName, withUpdates, {encoding: 'utf8'});

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
