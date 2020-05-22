import {StartModule} from '../../modules/dbms/start.module';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StartModule;

    static args = [ARGS.DBMSS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
