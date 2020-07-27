import {flags} from '@oclif/command';
import {ENVIRONMENT_TYPES} from '@relate/common';

import BaseCommand from '../../base.command';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';
import {InitModule} from '../../modules/environment/init.module';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static description = 'Create a new environment';

    static examples = [
        '$ relate env:init',
        '$ relate env:init --name=local-environment-name --type=LOCAL',
        '$ relate env:init --name=remote-environment-name --type=REMOTE --httpOrigin=https://url.of.hosted.relate.com',
    ];

    static aliases = ['env:init'];

    static flags = {
        httpOrigin: flags.string({
            description: `URL of the hosted instance of relate (only applies to --type=${ENVIRONMENT_TYPES.REMOTE})`,
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
        sandboxed: flags.boolean({
            description: 'Environment does not allow administrator privileges',
        }),
    };
}
