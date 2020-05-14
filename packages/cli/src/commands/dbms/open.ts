import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {OpenModule} from '../../modules/dbms/open.module';
import {DBMS_FLAGS} from '../../constants';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static args = [{name: 'nameOrId'}];

    static flags = {
        ...DBMS_FLAGS,
        log: flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
        }),
    };
}
