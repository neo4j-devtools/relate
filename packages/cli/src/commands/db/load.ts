import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {LoadModule} from '../../modules/db/load.module';

export default class LoadCommand extends BaseCommand {
    commandClass = LoadCommand;

    commandModule = LoadModule;

    static description = 'Load data into a database from a dump';

    static args = [ARGS.DBMS];

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        database: flags.string({
            char: 'd',
            default: 'neo4j',
            description: 'Database to load data into',
        }),
        force: flags.boolean({
            default: false,
            description: 'Force load data (WARNING! this will erase any existing data)',
        }),
        from: flags.string({
            char: 'f',
            default: '',
            description: 'Dump to load data from',
        }),
    };
}
