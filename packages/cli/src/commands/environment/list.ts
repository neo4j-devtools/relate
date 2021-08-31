import cli from 'cli-ux';

import BaseCommand from '../../base.command';
import {ListModule} from '../../modules/environment/list.module';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List all available environments';

    static examples = ['$ relate env:list'];

    static aliases = ['env:list'];

    static flags = {
        ...cli.table.flags({except: ['csv']}),
    };
}
