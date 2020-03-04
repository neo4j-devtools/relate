import {ListModule} from '../../modules/dbms/list.module';
import BaseCommand from '../../base.command';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static aliases = ['dbms:ls'];
}
