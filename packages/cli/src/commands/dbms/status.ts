import {cli} from 'cli-ux';

import {StatusModule} from '../../modules/dbms/status.module';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';

export default class StatusCommand extends BaseCommand {
    commandClass = StatusCommand;

    commandModule = StatusModule;

    static args = [ARGS.DBMSS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['extended', 'csv']}),
    };
}
