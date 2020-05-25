import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {InstallModule} from '../../modules/dbms/install.module';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static description = 'Install a Neo4j DBMS in the selected environment';

    static args = [ARGS.VERSION];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        name: flags.string({
            char: 'n',
            description: 'Name to give the newly installed DBMS',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
