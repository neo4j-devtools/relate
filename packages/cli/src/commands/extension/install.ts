import {flags} from '@oclif/command';

import {InstallModule} from '../../modules/extension/install.module';
import BaseCommand from '../../base.command';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static args = [{name: 'name'}];

    static flags = {
        version: flags.string({
            char: 'V',
            description: 'Version to install',
            required: false,
        }),
    };
}
