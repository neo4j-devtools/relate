import {ux, Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {ListModule} from '../../modules/db/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List databases within a DBMS';

    static examples = [
        '$ relate db:list',
        '$ relate db:list -e environment-name',
        '$ relate db:list',
        '$ relate db:list --columns=name,role -u dbms-user --no-header --no-truncate',
        '$ relate db:list --sort=name',
        '$ relate db:list --filter=name=db-name --output=json',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...ux.table.flags({except: ['extended', 'csv']}),
        user: Flags.string({
            char: 'u',
            description: 'The Neo4j DBMS user to list databases with (needs to have access to the system database)',
            default: 'neo4j',
        }),
        dbms: Flags.string({
            char: 'D',
            description: 'DBMS containing the databases to list (needs to be started and have an access token created)',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
