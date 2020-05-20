import {flags} from '@oclif/command';
import {InitModule} from '../../modules/environment/init.module';
import BaseCommand from '../../base.command';
import {ENVIRONMENT_TYPES} from '@relate/common/dist/environments';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class InitCommand extends BaseCommand {
    commandClass = InitCommand;

    commandModule = InitModule;

    static aliases = ['env:init'];

    static flags = {
        type: flags.enum({
            options: Object.values(ENVIRONMENT_TYPES),
            required: REQUIRED_FOR_SCRIPTS,
        }),
        name: flags.string({
            description: 'Name of the environment. Will be used in most commands.',
            required: REQUIRED_FOR_SCRIPTS,
        }),
        remoteUrl: flags.string({
            description: 'URL of the remote instance of relate',
            required: REQUIRED_FOR_SCRIPTS,
        }),
        remoteEnv: flags.string({
            description: 'Name of the hosted environment',
            required: false,
        }),
    };
}
