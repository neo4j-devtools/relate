import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {APITokenModule} from '../../modules/environment/api-token.module';

export default class APITokenCommand extends BaseCommand {
    commandClass = APITokenCommand;

    commandModule = APITokenModule;

    // eslint-disable-next-line max-len
    static description = `Generate API token for a relate web API calls`;

    static examples = [
        '$ relate env:api-token',
        '$ relate env:api-token -e environment-name',
        '$ relate env:api-token my-app',
        '$ relate env:api-token my-app -h localhost:3000',
    ];

    static aliases = ['env:api-token'];

    static args = [
        {
            description: 'App name',
            name: 'appName',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        hostName: flags.string({
            char: 'h',
            description: 'App host name (if other than current environment)',
        }),
    };
}
