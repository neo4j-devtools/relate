import BaseCommand from '../../base.command';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';
import {UninstallModule} from '../../modules/extension/uninstall.module';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static description = 'Uninstall an extension';

    static args = [
        {
            name: 'extension',
            description: 'Name of the extension to uninstall',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];
}
