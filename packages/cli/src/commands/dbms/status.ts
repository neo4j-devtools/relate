import {StatusModule} from '../../modules/dbms/status.module';
import BaseCommand from '../../base.command';

export default class StatusCommand extends BaseCommand {
    commandClass = StatusCommand;

    commandModule = StatusModule;

    static args = [{name: 'dbmsIds'}];

    static strict = false;
}