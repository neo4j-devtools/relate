import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {ExecModule} from '../../modules/db/exec.module';

export default class DumpCommand extends BaseCommand {
    commandClass = DumpCommand;

    commandModule = ExecModule;

    static description = 'Dump a database from a Neo4j DBMS';

    static args = [ARGS.DBMS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        database: flags.string({
            char: 'd',
            default: 'neo4j',
            description: 'Database',
        }),
        from: flags.string({
            char: 'f',
            default: '',
            description: 'Cypher file to load data from',
        }),
        user: flags.string({
            char: 'u',
            default: 'neo4j',
            description: 'DBMS user',
        }),
    };
}
