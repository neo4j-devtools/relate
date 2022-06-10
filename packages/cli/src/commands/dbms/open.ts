import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {OpenModule} from '../../modules/dbms/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = "Open a Neo4j DBMS's directory";

    static examples = ['$ relate dbms:open', '$ relate dbms:open -e environment-name', '$ relate dbms:open -L'];

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        log: Flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
        }),
    };
}
