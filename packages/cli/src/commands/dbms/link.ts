import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/dbms/link.module';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static description = 'Link an existing DBMS (useful for development)';

    static examples = ['$ relate dbms:link /path/to/target/dbms/dir "foo bar"'];

    static args = [
        {
            name: 'filePath',
            required: true,
        },
        {
            name: 'dbmsName',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        confirm: flags.string({
            char: 'y',
            description: 'Confirm DBMS configuration changes',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
