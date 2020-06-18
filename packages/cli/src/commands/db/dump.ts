import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {DumpModule} from '../../modules/db/dump.module';

export default class DumpCommand extends BaseCommand {
    commandClass = DumpCommand;

    commandModule = DumpModule;

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
        to: flags.string({
            char: 't',
            default: `${process.cwd()}/db-dump-${Date.now()}.dump`,
            description: 'Path and filename for dump',
        }),
    };
}
