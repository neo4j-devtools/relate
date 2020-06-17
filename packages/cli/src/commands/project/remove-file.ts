import BaseCommand from '../../base.command';

import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {RemoveFileModule} from '../../modules/project/remove-file.module';

export default class RemoveFileCommand extends BaseCommand {
    commandClass = RemoveFileCommand;

    commandModule = RemoveFileModule;

    static description = 'Removes a file from a project';

    static args = [
        {
            name: 'file',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
