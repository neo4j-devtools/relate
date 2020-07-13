import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {LoginModule} from '../../modules/environment/login.module';

export default class LoginCommand extends BaseCommand {
    commandClass = LoginCommand;

    commandModule = LoginModule;

    static description = 'Login into an environment';

    static aliases = ['env:login'];

    static examples = ['$ relate env:login -e environment-supporting-login'];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
