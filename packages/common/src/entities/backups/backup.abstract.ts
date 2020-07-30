import {List} from '@relate/types';

import {EnvironmentAbstract} from '../environments';
import {IRelateBackup} from '../../models';
import {ENTITY_TYPES} from '../../constants';
import {IRelateFilter} from '../../utils/generic';

export abstract class BackupAbstract<Env extends EnvironmentAbstract> {
    constructor(protected readonly environment: Env) {}

    abstract create(entityType: ENTITY_TYPES, entityNameOrId: string, entityMeta?: any): Promise<IRelateBackup>;

    abstract restore(filePath: string, outputPath?: string): Promise<{entityType: ENTITY_TYPES; entityId: string}>;

    abstract get(backupNameOrId: string): Promise<IRelateBackup>;

    abstract remove(backupNameOrId: string): Promise<IRelateBackup>;

    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateBackup>>;
}
