import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {IRelateBackup} from '../../models';
import {ENTITY_TYPES} from '../../constants';
import {IRelateFilter} from '../../utils/generic';

export abstract class BackupAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * Creates a backup of a relate entity
     * @param   entityType
     * @param   entityNameOrId
     * @param   entityMeta      Any additional meta to save in the backup manifest
     */
    abstract create(entityType: ENTITY_TYPES, entityNameOrId: string, entityMeta?: any): Promise<IRelateBackup>;

    /**
     * Restores a backup from path
     * @param   filePath
     * @param   outputPath
     */
    abstract restore(filePath: string, outputPath?: string): Promise<{entityType: ENTITY_TYPES; entityId: string}>;

    /**
     * Gets a backup
     * @param   backupNameOrId
     */
    abstract get(backupNameOrId: string): Promise<IRelateBackup>;

    /**
     * Removes a backup
     * @param   backupNameOrId
     */
    abstract remove(backupNameOrId: string): Promise<IRelateBackup>;

    /**
     * List all backups
     * @param   filters     Filters to apply
     */
    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateBackup>>;
}
