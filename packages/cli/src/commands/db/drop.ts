import {Args, Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {DropModule} from '../../modules/db/drop.module';

export default class DropCommand extends BaseCommand {
    commandClass = DropCommand;

    commandModule = DropModule;

    static description = 'Drop a database from a DBMS';

    static examples = [
        '$ relate db:drop',
        '$ relate db:drop -e environment-name',
        '$ relate db:drop my-new-db -D started-dbms',
        '$ relate db:drop my-new-db -D started-dbms -u dbms-user-with-system-db-access',
    ];

    static args = {
        name: Args.string({
            description: 'database name',
            reuqired: REQUIRED_FOR_SCRIPTS,
        }),
    };

    static flags = {
        ...FLAGS.ENVIRONMENT,
        user: Flags.string({
            char: 'u',
            description: 'The Neo4j DBMS user to drop the database with (needs to have access to the system database)',
            default: 'neo4j',
        }),
        dbms: Flags.string({
            char: 'D',
            description: 'DBMS containing the database to drop (needs to be started and have an access token created)',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
