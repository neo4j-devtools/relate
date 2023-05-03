import {Args, Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/dbms/link.module';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static description = 'Link to an existing DBMS installation\nLinking a DBMS enables relate to manage it.';

    static examples = ['$ relate dbms:link /path/to/target/dbms/dir "related DBMS"'];

    static args = {
        filePath: Args.string({
            required: true,
        }),
        dbmsName: Args.string({
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };

    static flags = {
        confirm: Flags.boolean({
            char: 'y',
            description: 'Confirm DBMS configuration changes',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
