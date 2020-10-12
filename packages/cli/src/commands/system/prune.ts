import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {PruneModule} from '../../modules/system/prune.module';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';

export default class PruneCommand extends BaseCommand {
    commandClass = PruneCommand;

    commandModule = PruneModule;

    static description = 'Delete all data, configuration and cache';

    static examples = ['$ relate system:prune'];

    static flags = {
        yes: flags.boolean({
            char: 'y',
            description: 'Confirm DBMS configuration changes',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
