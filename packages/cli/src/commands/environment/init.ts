import {InitModule} from '../../modules/environment/init.module';
import BaseCommand from '../../base.command';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static aliases = ['env:init'];
}
