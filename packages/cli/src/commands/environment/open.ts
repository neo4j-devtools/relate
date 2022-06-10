import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS} from '../../constants';
import {OpenModule} from '../../modules/environment/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = "Open an environment's configuration with your default editor";

    static examples = [
        '$ relate env:open',
        '$ relate env:open environment-name',
        '$ relate env:open environment-name -L',
    ];

    static aliases = ['env:open'];

    static args = [ARGS.ENVIRONMENT];

    static flags = {
        log: Flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
            required: false,
        }),
    };
}
