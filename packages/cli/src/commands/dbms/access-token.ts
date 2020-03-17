import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {AccessTokenModule} from '../../modules/dbms/access-token.module';

export default class AccessTokenCommand extends BaseCommand {
    commandClass = AccessTokenCommand;

    commandModule = AccessTokenModule;

    static args = [{name: 'dbmsId'}];

    static flags = {
        credentials: flags.string({char: 'c'}),
        principal: flags.string({char: 'p'}),
    };
}
