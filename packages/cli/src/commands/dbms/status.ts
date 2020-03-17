import {cli} from 'cli-ux';

import {StatusModule} from '../../modules/dbms/status.module';
import BaseCommand from '../../base.command';
import {DBMS_FLAGS} from '../../constants';

export default class StatusCommand extends BaseCommand {
    commandClass = StatusCommand;

    commandModule = StatusModule;

    static args = [{name: 'dbmsIds'}];

    static strict = false;

    static flags = {
        ...cli.table.flags({except: ['extended', 'csv']}),
        ...DBMS_FLAGS,
    };
}
