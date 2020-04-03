import {StopModule} from '../../modules/dbms/stop.module';
import BaseCommand from '../../base.command';
import {DBMS_FLAGS} from '../../constants';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StopModule;

    static args = [{name: 'dbmsIds'}];

    static strict = false;

    static flags = {
        ...DBMS_FLAGS,
    };
}
