import {CliUx} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {ListModule} from '../../modules/dbms-plugin/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List plugins installed in a Neo4j DBMS';

    static aliases = ['plugin:list'];

    static examples = [
        '$ relate dbms-plugin:list MyDbms',
        '$ relate dbms-plugin:list MyDbms -e environment-name',
        '$ relate dbms-plugin:list MyDbms --columns=id,name --no-header --no-truncate',
        '$ relate dbms-plugin:list MyDbms --sort=name',
        '$ relate dbms-plugin:list MyDbms --filter=name=my-dbms --output=json',
    ];

    static args = {...ARGS.DBMS};

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...CliUx.ux.table.flags({except: ['csv']}),
    };
}
