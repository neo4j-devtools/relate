import {ux, Flags} from '@oclif/core';

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
        '$ relate project:list-files --ignore node_module --ignore dist',
        '$ relate project:list-files --ignore node_module,dist',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        ...ux.table.flags({except: ['csv']}),
        ignore: Flags.string({
            description: 'List of directories to ignore',
            char: 'i',
            multiple: true,
            default: ['node_modules', '.git'],
        }),
        limit: Flags.integer({
            description: 'Max number of files to list',
            char: 'l',
        }),
    };
}
