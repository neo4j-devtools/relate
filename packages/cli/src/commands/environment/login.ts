import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {LoginModule} from '../../modules/environment/login.module';

export default class LoginCommand extends BaseCommand {
    commandClass = LoginCommand;

    commandModule = LoginModule;

    static aliases = ['env:login'];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
