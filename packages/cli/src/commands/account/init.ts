import {InitModule} from '../../modules/account/init.module';
import BaseCommand from '../../base.command';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;
}
