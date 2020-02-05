import {StartModule} from '../../modules/dbms/start.module';
import BaseCommand from '../../base.command';

export default class StartCommand extends BaseCommand {
    commandClass = StartCommand;

    commandModule = StartModule;

    static args = [
        {
            name: 'dbmsID',
            required: true,
        },
    ];
}
