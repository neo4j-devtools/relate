import {StopModule} from '../../modules/dbms/stop.module';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';

export default class StopCommand extends BaseCommand {
    commandClass = StopCommand;

    commandModule = StopModule;

    static args = [ARGS.DBMSS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
