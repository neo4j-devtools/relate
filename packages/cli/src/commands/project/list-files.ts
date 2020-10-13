import BaseCommand from '../../base.command';

import {FLAGS} from '../../constants';
import {ListFilesModule} from '../../modules/project/list-files.module';

export default class ListFilesCommand extends BaseCommand {
    commandClass = ListFilesCommand;

    commandModule = ListFilesModule;

    static description = 'List project files';

    static examples = [
        '$ relate project:list-files',
        '$ relate project:list-files -e environment-name',
        '$ relate project:list-files -p my-project',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
