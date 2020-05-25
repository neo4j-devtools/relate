import cli from 'cli-ux';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {ListModule} from '../../modules/dbms/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List available Neo4j DBMSs in the selected environment';

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['extended', 'csv']}),
    };
}
