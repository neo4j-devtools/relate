import BaseCommand from '../../base.command';

import {FLAGS} from '../../constants';
import {ListFilesModule} from '../../modules/project/list-files.module';

export default class ListFilesCommand extends BaseCommand {
    commandClass = ListFilesCommand;

    commandModule = ListFilesModule;

    static description = 'Lists project files';

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
