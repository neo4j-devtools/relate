import {cli} from 'cli-ux';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {InfoModule} from '../../modules/dbms/info.module';

export default class InfoCommand extends BaseCommand {
    commandClass = InfoCommand;

    commandModule = InfoModule;

    static description = 'Show the status of one or more Neo4j DBMSs';

    static args = [ARGS.DBMSS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['csv']}),
    };
}
