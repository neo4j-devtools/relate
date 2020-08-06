import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {RestoreModule} from '../../modules/backup/restore.module';

export default class RestoreCommand extends BaseCommand {
    commandClass = RestoreCommand;

    commandModule = RestoreModule;

    static description = 'Restore backup';

    static examples = [
        '$ relate backup:restore <backup-id-or-path>',
        '$ relate backup:restore -e environment-name',
        '$ relate backup:restore <backup-id-or-path> <output-path>',
    ];

    static args = [
        {
            name: 'backupIdOrPath',
            description: 'Backup ID or path',
            required: true,
        },
        {
            name: 'outputPath',
            description: 'destination of backup',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
