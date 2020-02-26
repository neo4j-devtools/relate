import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {AccessModule} from '../../modules/dbms/access.module';

export default class AccessCommand extends BaseCommand {
    commandClass = AccessCommand;

    commandModule = AccessModule;

    static args = [{name: 'dbmsId'}];

    static flags = {
        credentials: flags.string({char: 'c'}),
        principal: flags.string({char: 'p'}),
    };

    static strict = false;
}
