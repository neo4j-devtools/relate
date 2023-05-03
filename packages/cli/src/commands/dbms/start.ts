import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {StartModule} from '../../modules/dbms/start.module';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StartModule;

    static description = 'Start one or more Neo4j DBMSs';

    static examples = [
        '$ relate dbms:start',
        '$ relate dbms:start my-dbms',
        '$ relate dbms:start my-dbms my-other-dbms',
        '$ relate dbms:start -e environment-name',
    ];

    static args = {...ARGS.DBMSS};

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
