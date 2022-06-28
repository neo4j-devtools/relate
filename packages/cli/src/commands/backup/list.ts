import {CliUx, Flags} from '@oclif/core';
import {ENTITY_TYPES} from '@relate/common';

import BaseCommand from '../../base.command';
import {FLAGS, VALID_BACKUP_TYPES} from '../../constants';
import {ListModule} from '../../modules/backup/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List resource backups';

    static examples = [
        '$ relate backup:list',
        '$ relate backup:list -e environment-name',
        '$ relate backup:list --columns=entityType,entityId --no-header --no-truncate',
        '$ relate backup:list --sort=created',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...CliUx.ux.table.flags({except: ['extended', 'csv']}),
        type: Flags.enum<ENTITY_TYPES>({
            char: 't',
            options: VALID_BACKUP_TYPES,
            description: 'The relate entity type',
        }),
    };
}
