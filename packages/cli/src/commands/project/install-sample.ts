import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';

import {FLAGS} from '../../constants';
import {InstallSampleModule} from '../../modules/project/install-sample.module';

export default class InstallSampleCommand extends BaseCommand {
    commandClass = InstallSampleCommand;

    commandModule = InstallSampleModule;

    static description = 'Install sample project';

    static examples = ['$ relate project:install-sample'];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
        to: Flags.string({
            char: 't',
            description: 'Path where the project directory will be created.',
        }),
    };
}
