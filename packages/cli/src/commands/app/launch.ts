import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {LaunchModule} from '../../modules/app/launch.module';
import {DBMS_FLAGS, DEFAULT_WEB_HOST} from '../../constants';

export default class LaunchCommand extends BaseCommand {
    commandClass = LaunchCommand;

    commandModule = LaunchModule;

    static args = [{name: 'appId'}];

    static flags = {
        ...DBMS_FLAGS,
        dbmsId: flags.string({
            char: 'D',
            required: true,
        }),
        host: flags.string({
            char: 'H',
            default: DEFAULT_WEB_HOST,
        }),
        // @todo: clarify that access token must have already been created for principal
        principal: flags.string({
            char: 'P',
            required: true,
        }),
    };
}
