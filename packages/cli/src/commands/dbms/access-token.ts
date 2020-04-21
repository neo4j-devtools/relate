import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {AccessTokenModule} from '../../modules/dbms/access-token.module';
import {DBMS_FLAGS} from '../../constants';

export default class AccessTokenCommand extends BaseCommand {
    commandClass = AccessTokenCommand;

    commandModule = AccessTokenModule;

    static args = [{name: 'dbmsId'}];

    static flags = {
        ...DBMS_FLAGS,
        credentials: flags.string({char: 'C'}),
        principal: flags.string({char: 'P'}),
    };
}
