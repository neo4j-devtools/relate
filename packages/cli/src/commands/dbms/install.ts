import {flags} from '@oclif/command';

import {InstallModule} from '../../modules/dbms/install.module';
import BaseCommand from '../../base.command';
import {DBMS_FLAGS} from '../../constants';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static args = [{name: 'name'}];

    static flags = {
        ...DBMS_FLAGS,
        credentials: flags.string({
            char: 'C',
            description: 'Initial password to set',
        }),
        version: flags.string({
            char: 'V',
            description: 'Version to install',
        }),
    };
}
