import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {OpenModule} from '../../modules/dbms/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = "Open a Neo4j DBMS's directory";

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        log: flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
        }),
    };
}
