import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS} from '../../constants';
import {InitModule} from '../../modules/environment/init.module';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static description = 'Initialize a new relate environment';

    static examples = [
        '$ relate env:init environment-name',
        '$ relate env:init environment-name --use',
        '$ relate env:init environment-name --interactive',
    ];

    static aliases = ['env:init'];

    static args = {...ARGS.ENVIRONMENT};

    static flags = {
        interactive: Flags.boolean({
            description: 'Get prompted for each configuration option available',
            char: 'i',
        }),
        use: Flags.boolean({
            description: 'Set environment as active right after creating it',
        }),
        noRuntime: Flags.boolean({
            description: 'Skip downloading the Java runtime required by the DBMS',
        }),
        apiToken: Flags.boolean({
            description:
                // eslint-disable-next-line max-len
                'If this flag is provided and the environment created is set as active, all requests to @relate/web will require API tokens',
        }),
    };
}
