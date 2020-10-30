import BaseCommand from '../../base.command';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';
import {UseModule} from '../../modules/environment/use.module';

export default class UseCommand extends BaseCommand {
    commandClass = UseCommand;

    commandModule = UseModule;

    static description = 'Set an environment as default';

    static examples = ['$ relate env:use environment-to-set-as-active'];

    static aliases = ['env:use'];

    static args = [
        {
            name: 'environment',
            description: 'Name of the environment to set as active',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];
}
