import {CliUx} from '@oclif/core';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {AddSourcesModule} from '../../modules/dbms-plugin/add-sources.module';

export default class AddSourcesCommand extends BaseCommand {
    commandClass = AddSourcesCommand;

    commandModule = AddSourcesModule;

    static description = 'Add one or more plugin sources';

    static aliases = ['plugin:add-sources'];

    static examples = [
        '$ relate dbms-plugin:add-sources',
        '$ relate dbms-plugin:add-sources -e environment-name',
        '$ relate dbms-plugin:add-sources http://github.com/some/plugin/.neo4j-plugin-source',
        '$ relate dbms-plugin:add-sources ./local/.neo4j-plugin-source',
    ];

    static strict = false;

    static args = [
        {
            name: 'sources',
            description: 'File path or URL to plugin sources',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...CliUx.ux.table.flags({except: ['csv']}),
    };
}
