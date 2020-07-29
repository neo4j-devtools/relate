import {List} from '@relate/types';

import {RemoteEnvironment} from '../environments';
import {IRelateBackup} from '../../models';
import {ENTITY_TYPES} from '../../constants';
import {IRelateFilter} from '../../utils/generic';
import {BackupAbstract} from './backup.abstract';
import {NotSupportedError} from '../../errors';

export class RemoteBackups extends BackupAbstract<RemoteEnvironment> {
    create(_entityType: ENTITY_TYPES, _entityNameOrId: string, _entityMeta: any = {}): Promise<IRelateBackup> {
        throw new NotSupportedError(`${RemoteBackups.name} does not support creating backups`);
    }

    restore(_filePath: string, _outputPath?: string): Promise<IRelateBackup> {
        throw new NotSupportedError(`${RemoteBackups.name} does not support restoring backups`);
    }

    get(_backupNameOrId: string): Promise<IRelateBackup> {
        throw new NotSupportedError(`${RemoteBackups.name} does not support getting backups`);
    }

    remove(_backupNameOrId: string): Promise<IRelateBackup> {
        throw new NotSupportedError(`${RemoteBackups.name} does not support removing backups`);
    }

    list(_filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateBackup>> {
        throw new NotSupportedError(`${RemoteBackups.name} does not support listing backups`);
    }
}
