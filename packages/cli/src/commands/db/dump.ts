import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {DumpModule} from '../../modules/db/dump.module';

export default class DumpCommand extends BaseCommand {
    commandClass = DumpCommand;

    commandModule = DumpModule;

    static description = 'Dump data from database';

    static examples = [
        '$ relate db:dump',
        '$ relate db:dump -e environment-name',
        '$ relate db:dump dbms-containing-db-to-dump -d db-to-dump',
        '$ relate db:dump dbms-containing-db-to-dump -d db-to-dump -t /path/to/save/dump/file/to',
    ];

    static args = [ARGS.DBMS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        database: Flags.string({
            char: 'd',
            default: 'neo4j',
            description: 'Database',
        }),
        to: Flags.string({
            char: 't',
            description: 'Path and filename for dump (defaults to a "dbmsName-db-date-time.dump")',
        }),
    };
}
