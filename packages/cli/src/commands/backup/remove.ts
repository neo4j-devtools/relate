import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {RemoveModule} from '../../modules/backup/remove.module';

export default class RemoveCommand extends BaseCommand {
    commandClass = RemoveCommand;

    commandModule = RemoveModule;

    static description = 'Removes a backup';

    static examples = ['$ relate backup:remove <backup-id-or-path>', '$ relate backup:remove -e environment-name'];

    static args = [
        {
            name: 'backupId',
            description: 'Backup ID',
            required: true,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
