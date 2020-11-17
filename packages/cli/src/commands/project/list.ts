import cli from 'cli-ux';

import BaseCommand from '../../base.command';
import {ListModule} from '../../modules/project/list.module';
import {FLAGS} from '../../constants';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static description = 'List all projects';

    static examples = ['$ relate project:list', '$ relate project:list -e environment-name'];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...cli.table.flags({except: ['csv']}),
    };
}
