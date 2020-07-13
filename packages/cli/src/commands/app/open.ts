import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {OpenModule} from '../../modules/app/open.module';

export default class OpenCommand extends BaseCommand {
    commandClass = OpenCommand;

    commandModule = OpenModule;

    static description = 'Open Graph App';

    static examples = [
        '$ relate app:open',
        '$ relate app:open app-name',
        '$ relate app:open app-name -D dbms-to-connect-to -u user-with-access-token',
        '$ relate app:open app-name -D dbms-to-connect-to -e environment-name -L',
    ];

    static args = [
        {
            name: 'appName',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        dbmsId: flags.string({
            char: 'D',
            description: 'The DBMS to automatically connect to',
            required: false,
        }),
        log: flags.boolean({
            char: 'L',
            description: 'If set, log the path instead',
            required: false,
        }),
        user: flags.string({
            char: 'u',
            description: 'The Neo4j DBMS user to automatically connect with, assuming an access token exists',
            required: false,
        }),
    };
}
