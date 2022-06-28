import {CliUx} from '@oclif/core';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {ListModule} from '../../modules/dbms/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List installed Neo4j DBMSs';

    static examples = [
        '$ relate dbms:list',
        '$ relate dbms:list -e environment-name',
        '$ relate dbms:list --columns=id,name --no-header --no-truncate',
        '$ relate dbms:list --sort=name',
        '$ relate dbms:list --filter=name=my-dbms --output=json',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...CliUx.ux.table.flags({except: ['csv']}),
    };
}
