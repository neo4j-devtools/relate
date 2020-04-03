import {StartModule} from '../../modules/dbms/start.module';
import BaseCommand from '../../base.command';
import {DBMS_FLAGS} from '../../constants';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StartModule;

    static args = [{name: 'dbmsIds'}];

    static strict = false;

    static flags = {
        ...DBMS_FLAGS,
    };
}
