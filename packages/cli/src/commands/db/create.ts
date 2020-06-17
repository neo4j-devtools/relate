import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {CreateModule} from '../../modules/db/create.module';

export default class CreateCommand extends BaseCommand {
    commandClass = CreateCommand;

    commandModule = CreateModule;

    static description = 'Create a new database';

    static args = [
        {
            name: 'name',
            description: 'database name',
            reuqired: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        user: flags.string({
            char: 'u',
            description:
                'The Neo4j DBMS user to create the database with (needs to have access to the system database)',
            default: 'neo4j',
        }),
        dbms: flags.string({
            char: 'D',
            description: 'DBMS to create database in',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
