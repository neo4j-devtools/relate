import {InstallModule} from '../../modules/extension/install.module';
import BaseCommand from '../../base.command';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static args = [
        {
            name: 'name',
            required: true,
        },
        {
            name: 'version',
            required: true,
            description: 'Version to install',
        },
    ];
}
