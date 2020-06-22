import {flags} from '@oclif/command';
import cli from 'cli-ux';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {ListModule} from '../../modules/db/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List a database';

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['extended', 'csv']}),
        user: flags.string({
            char: 'u',
            description: 'The Neo4j DBMS user to list databases with (needs to have access to the system database)',
            default: 'neo4j',
        }),
        dbms: flags.string({
            char: 'D',
            description: 'DBMS containing the databases to list',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
