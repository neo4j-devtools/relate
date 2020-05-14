import {flags} from '@oclif/command';

import {InstallModule} from '../../modules/dbms/install.module';
import BaseCommand from '../../base.command';
import {DBMS_FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static args = [
        {
            name: 'name',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...DBMS_FLAGS,
        version: flags.string({
            char: 'V',
            description: 'Version to install',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
