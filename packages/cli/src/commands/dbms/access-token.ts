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
        account: flags.string({
            char: 'A',
            description: 'Account to run the command against',
            required: true,
        }),
        credentials: flags.string({
            char: 'c',
            required: true,
        }),
        principal: flags.string({
            char: 'p',
            required: true,
        }),
    };
}
