import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {AddDbmsModule} from '../../modules/project/add-dbms.module';

export default class AddDbmsCommand extends BaseCommand {
    commandClass = AddDbmsCommand;

    commandModule = AddDbmsModule;

    static description = 'Adds a dbms to a project';

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        name: flags.string({
            char: 'n',
            description: 'Project DBMS name',
        }),
        user: flags.string({
            char: 'u',
            default: 'neo4j',
            description: 'Neo4j DBMS user to create the token for',
        }),
    };
}
