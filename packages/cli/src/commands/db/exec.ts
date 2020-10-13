import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {ExecModule} from '../../modules/db/exec.module';

export default class DumpCommand extends BaseCommand {
    commandClass = DumpCommand;

    commandModule = ExecModule;

    static description = 'Execute a query against a database';

    static examples = [
        '$ relate db:exec -f /path/to/cypher/file',
        '$ relate db:exec -f /path/to/cypher/file -e environment-name',
        '$ relate db:exec dbms-containing-db-to-load-into -f /path/to/cypher/file -d db-to-load-into',
        '$ relate db:exec dbms-containing-db-to-load-into -f /path/to/cypher/file -d db-to-load-into --force',
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
            description: 'Cypher file to load data from',
            required: true,
        }),
        user: flags.string({
            char: 'u',
            default: 'neo4j',
            description: 'DBMS user',
        }),
    };
}
