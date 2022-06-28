import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {AddDbmsModule} from '../../modules/project/add-dbms.module';

export default class AddDbmsCommand extends BaseCommand {
    commandClass = AddDbmsCommand;

    commandModule = AddDbmsModule;

    static description = 'Add a DBMS connection to a project';

    static examples = [
        '$ relate project:add-dbms',
        '$ relate project:add-dbms -e environment-name',
        '$ relate project:add-dbms -p my-project',
        '$ relate project:add-dbms -p my-project -n dbms-name-in-project -u dbms-user-to-create-token-for',
    ];

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        name: Flags.string({
            char: 'n',
            description: 'Project DBMS name',
        }),
        user: Flags.string({
            char: 'u',
            default: 'neo4j',
            description: 'Neo4j DBMS user to create the token for',
        }),
    };
}
