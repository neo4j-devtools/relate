import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {DumpModule} from '../../modules/dbms/dump.module';

export default class DumpCommand extends BaseCommand {
    commandClass = DumpCommand;

    commandModule = DumpModule;

    static description = 'Dump a database from a Neo4j DBMS';

    static args = [ARGS.DBMS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        db: flags.string({
            char: 'd',
            default: 'neo4j',
            description: 'Database',
        }),
        outputDir: flags.string({
            char: 'o',
            default: process.cwd(),
            description: 'Output dir',
        }),
    };
}
