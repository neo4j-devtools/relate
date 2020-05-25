import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {OpenModule} from '../../modules/environment/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = "Open an environment's configuration with the default editor";

    static aliases = ['env:open'];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        log: flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
            required: false,
        }),
    };
}
