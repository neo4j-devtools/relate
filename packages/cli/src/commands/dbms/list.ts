import cli from 'cli-ux';

import {ListModule} from '../../modules/dbms/list.module';
import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['extended', 'csv']}),
    };
}
