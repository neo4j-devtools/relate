import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/dbms/link.module';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static description = 'Link an existing DBMS (useful for development)';

    static examples = ['$ relate dbms:link /path/to/target/dbms/dir --name foo'];

    static args = [{name: 'filePath'}];

    static flags = {
        name: flags.string({
            char: 'n',
            description: 'Name to give the linked DBMS',
            required: REQUIRED_FOR_SCRIPTS,
        }),
        yes: flags.string({
            char: 'y',
            description: 'Confirm DBMS config alteration',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
