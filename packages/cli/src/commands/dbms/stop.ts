import {StopModule} from '../../modules/dbms/stop.module';
import BaseCommand from '../../base.command';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StopModule;

    static args = [
        {
            name: 'dbmsIds',
            required: true,
        },
    ];

    static strict = false;
}
