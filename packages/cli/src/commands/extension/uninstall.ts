import {flags} from '@oclif/command';

import {UninstallModule} from '../../modules/extension/uninstall.module';
import BaseCommand from '../../base.command';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static args = [{name: 'name'}];

    static flags = {
        type: flags.string({
            char: 'T',
            description: 'Extension type',
        }),
        version: flags.string({
            char: 'V',
            description: 'Version to uninstall',
            required: false,
        }),
    };
}
