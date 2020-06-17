import BaseCommand from '../../base.command';
import {ListModule} from '../../modules/project/list.module';
import {FLAGS} from '../../constants';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'Lists all projects';

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
