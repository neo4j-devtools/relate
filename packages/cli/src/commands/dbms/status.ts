import {cli} from 'cli-ux';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {StatusModule} from '../../modules/dbms/status.module';

export default class StatusCommand extends BaseCommand {
    commandClass = StatusCommand;

    commandModule = StatusModule;

    static description = 'Show the status of one or more Neo4j DBMSs';

    static args = [ARGS.DBMSS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['extended', 'csv']}),
    };
}
