import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';

import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {AddFileModule} from '../../modules/project/add-file.module';

export default class AddFileCommand extends BaseCommand {
    commandClass = AddFileCommand;

    commandModule = AddFileModule;

    static description = 'Adds a file to a project';

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
            description: 'The relative path (directory) to add the file to in the project',
        }),
    };
}
