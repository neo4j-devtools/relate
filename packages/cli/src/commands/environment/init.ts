import {flags} from '@oclif/command';
import {ENVIRONMENT_TYPES} from '@relate/common';

import BaseCommand from '../../base.command';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';
import {InitModule} from '../../modules/environment/init.module';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static description = 'Create a new environment';

    static aliases = ['env:init'];

    static flags = {
        httpOrigin: flags.string({
            description: `URL of the hosted instance of relate (only applies to --type=${ENVIRONMENT_TYPES.REMOTE})`,
            required: REQUIRED_FOR_SCRIPTS,
        }),
        name: flags.string({
            description: 'Name of the environment to initialize',
            required: REQUIRED_FOR_SCRIPTS,
        }),
        type: flags.enum({
            description: 'Type of environment',
            options: Object.values(ENVIRONMENT_TYPES),
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
