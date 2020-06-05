import BaseCommand from '../../base.command';

import {UninstallModule} from '../../modules/extension/uninstall.module';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static aliases = ['ext:uninstall'];

    static description = 'Uninstall an extension';

    static args = [
        {
            description: 'Name of the extension to uninstall',
            name: 'extension',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
