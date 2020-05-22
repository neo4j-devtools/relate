import {flags} from '@oclif/command';

import {InstallModule} from '../../modules/dbms/install.module';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

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
