import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';

import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {AddFileModule} from '../../modules/project/add-file.module';

export default class AddFileCommand extends BaseCommand {
    commandClass = AddFileCommand;

    commandModule = AddFileModule;

    static description = 'Add a file to a project';

    static examples = [
        '$ relate project:add-file',
        '$ relate project:add-file -e environment-name',
        '$ relate project:add-file -p my-project -d relative/path/to/dest.file /path/to/source.file',
        '$ relate project:add-file -p my-project -d /path/to/existing-dest.file /path/to/source.file --overwrite',
    ];

    static args = [
        {
            name: 'source',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        destination: flags.string({
            char: 'd',
            description: 'The relative path of the file (including name) in the project',
        }),
        overwrite: flags.boolean({
            default: false,
            description: 'Overwrite existing destination file',
        }),
    };
}
