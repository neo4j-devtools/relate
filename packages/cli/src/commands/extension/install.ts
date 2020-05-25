import BaseCommand from '../../base.command';
import {InstallModule} from '../../modules/extension/install.module';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static description = 'Install an extension';

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
