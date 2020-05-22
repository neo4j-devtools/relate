import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {OpenModule} from '../../modules/environment/open.module';
import {FLAGS} from '../../constants';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

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
