import BaseCommand from '../../base.command';
import {ListModule} from '../../modules/environment/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'Lists all available environments';

    static aliases = ['env:list'];
}
