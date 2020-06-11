import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {InitModule} from '../../modules/project/init.module';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static description = 'Create a new project';

    static flags = {
        ...FLAGS.ENVIRONMENT,
        name: flags.string({
            description: 'Name of the project to initialize',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
