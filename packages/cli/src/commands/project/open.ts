import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';

import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {OpenModule} from '../../modules/project/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = 'Opens a project folder';

    static args = [
        {
            name: 'name',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        log: flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
        }),
    };
}
