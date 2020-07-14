import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {InitModule} from '../../modules/project/init.module';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static description = 'Create a new project';

    static examples = [
        '$ relate project:init /path/to/target/project/dir',
        '$ relate project:init /path/to/target/project/dir -e environment-name',
        '$ relate project:init /path/to/target/project/dir --name=my-project',
    ];

    static args = [
        {
            name: 'targetDir',
            // @todo: this is optional is projects.abstract
            required: true,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        name: flags.string({
            description: 'Name of the project to initialize',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
