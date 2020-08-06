import BaseCommand from '../../base.command';
import {ARGS} from '../../constants';
import {LoginModule} from '../../modules/environment/login.module';

export default class LoginCommand extends BaseCommand {
    commandClass = LoginCommand;

    commandModule = LoginModule;

    static description = 'Login into an environment';

    static aliases = ['env:login'];

    static examples = ['$ relate env:login', '$ relate env:login environment-supporting-login'];

    static args = [ARGS.ENVIRONMENT];
}
