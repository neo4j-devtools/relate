import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {ExecModule} from '../../modules/db/exec.module';

export default class ExecCommand extends BaseCommand {
    commandClass = ExecCommand;

    commandModule = ExecModule;

    static description = 'Execute a query against a database';

    static examples = [
        '$ relate db:exec -f /path/to/cypher/file',
        '$ relate db:exec -f /path/to/cypher/file -e environment-name',
        '$ relate db:exec dbms-containing-db-to-query -f /path/to/cypher/file -d db-to-query',
        '$ relate db:exec dbms-containing-db-to-query -f /path/to/cypher/file -d db-to-query --force',
    ];

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
            description: 'Cypher file to run',
            required: true,
        }),
        user: flags.string({
            char: 'u',
            default: 'neo4j',
            description: 'DBMS user',
        }),
    };
}
