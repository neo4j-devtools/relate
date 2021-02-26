import {flags} from '@oclif/command';
import {ENVIRONMENT_TYPES} from '@relate/common';

import BaseCommand from '../../base.command';
import {ARGS} from '../../constants';
import {InitModule} from '../../modules/environment/init.module';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static description = 'Initialize a new relate environment';

    static examples = [
        '$ relate env:init local-environment-name',
        '$ relate env:init local-environment-name --use',
        '$ relate env:init remote-environment-name https://url.of.hosted.relate.com --type=REMOTE',
        '$ relate env:init environment-name --interactive',
    ];

    static aliases = ['env:init'];

    static args = [
        ARGS.ENVIRONMENT,
        {
            description: 'URL of the hosted instance of relate (only applies to --type=REMOTE)',
            name: 'httpOrigin',
            required: false,
        },
    ];

    static flags = {
        type: flags.enum({
            description: 'Type of environment',
            options: Object.values(ENVIRONMENT_TYPES),
        }),
        interactive: flags.boolean({
            description: 'Get prompted for each configuration option available',
            char: 'i',
        }),
        use: flags.boolean({
            description: 'Set environment as active right after creating it',
        }),
        noRuntime: flags.boolean({
            description: 'Skip downloading the Java runtime required by the DBMS',
        }),
    };
}
