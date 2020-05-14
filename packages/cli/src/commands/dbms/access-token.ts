import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {AccessTokenModule} from '../../modules/dbms/access-token.module';
import {DBMS_FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class AccessTokenCommand extends BaseCommand {
    commandClass = AccessTokenCommand;

    commandModule = AccessTokenModule;

    static args = [
        {
            name: 'dbmsId',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...DBMS_FLAGS,
        principal: flags.string({
            char: 'P',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
