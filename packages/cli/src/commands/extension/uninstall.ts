import {UninstallModule} from '../../modules/extension/uninstall.module';
import BaseCommand from '../../base.command';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static args = [{name: 'name'}];

    static flags = {};
}
