import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';

import {InstallModule} from '../../modules/extension/install.module';
import {FLAGS} from '../../constants';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static description = 'Install an extension';

    static args = [
        {
            name: 'name',
            required: true,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        version: flags.string({
            char: 'V',
            description: 'Version to install',
            required: true,
        }),
    };
}
