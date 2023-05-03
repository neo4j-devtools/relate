import {Args} from '@oclif/core';
import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {RemoveModule} from '../../modules/backup/remove.module';

export default class RemoveCommand extends BaseCommand {
    commandClass = RemoveCommand;

    commandModule = RemoveModule;

    static description = 'Remove a resource backup';

    static examples = ['$ relate backup:remove <backup-id-or-path>', '$ relate backup:remove -e environment-name'];

    static args = {
        backupId: Args.string({
            description: 'Backup ID',
            required: true,
        }),
    };

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
