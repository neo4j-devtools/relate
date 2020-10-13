import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';

import {FLAGS} from '../../constants';
import {OpenModule} from '../../modules/project/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = "Open a project's folder";

    static examples = [
        '$ relate project:open',
        '$ relate project:open -e environment-name',
        '$ relate project:open -p my-project',
        '$ relate project:open -p my-project -L',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        log: flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
        }),
    };
}
