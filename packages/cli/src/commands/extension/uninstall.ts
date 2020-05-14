import {UninstallModule} from '../../modules/extension/uninstall.module';
import BaseCommand from '../../base.command';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static args = [
        {
            name: 'name',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {};
}
