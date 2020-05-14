import BaseCommand from '../../base.command';
import {DBMS_FLAGS} from '../../constants';
import {LoginModule} from '../../modules/environment/login.module';

export default class LoginCommand extends BaseCommand {
    commandClass = LoginCommand;

    commandModule = LoginModule;

    static flags = {
        ...DBMS_FLAGS,
    };
}
