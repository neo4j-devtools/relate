import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {DropModule} from '../../modules/db/drop.module';

export default class DropCommand extends BaseCommand {
    commandClass = DropCommand;

    commandModule = DropModule;

    static description = 'Drop a database';

    static args = [
        {
            name: 'name',
            description: 'database name',
            reuqired: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        user: flags.string({
            char: 'u',
            description: 'The Neo4j DBMS user to drop the database with (needs to have access to the system database)',
            default: 'neo4j',
        }),
        dbms: flags.string({
            char: 'D',
            description: 'DBMS containing the database to drop',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
