import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {StartModule} from '../../modules/dbms/start.module';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StartModule;

    static description = 'Start one or more Neo4j DBMSs';

    static args = [ARGS.DBMSS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
