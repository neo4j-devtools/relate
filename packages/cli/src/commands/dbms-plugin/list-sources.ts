import {CliUx} from '@oclif/core';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {ListSourcesModule} from '../../modules/dbms-plugin/list-sources.module';

export default class ListSourcesCommand extends BaseCommand {
    commandClass = ListSourcesCommand;

    commandModule = ListSourcesModule;

    static description = 'List available plugin sources';

    static aliases = ['plugin:list-sources'];

    static examples = [
        '$ relate dbms-plugin:list-sources',
        '$ relate dbms-plugin:list-sources -e environment-name',
        '$ relate dbms-plugin:list-sources --columns=id,name --no-header --no-truncate',
        '$ relate dbms-plugin:list-sources --sort=name',
        '$ relate dbms-plugin:list-sources --filter=name=my-dbms --output=json',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...CliUx.ux.table.flags({except: ['csv']}),
    };
}
