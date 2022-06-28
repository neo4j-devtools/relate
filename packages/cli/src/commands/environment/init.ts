import {flags} from '@oclif/command';

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

    static args = [ARGS.ENVIRONMENT];

    static flags = {
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
        apiToken: flags.boolean({
            description:
                // eslint-disable-next-line max-len
                'If this flag is provided and the environment created is set as active, all requests to @relate/web will require API tokens',
        }),
    };
}
