import BaseCommand from '../../base.command';

import {ListModule} from '../../modules/extension/list.module';
import {FLAGS} from '../../constants';

export default class ListCommand extends BaseCommand {
    commandClass = ListCommand;

    commandModule = ListModule;

    static aliases = ['ext:list'];

    static description = 'List installed Relate extensions';

    static examples = ['$ relate ext:list', '$ relate ext:list -e environment-name'];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
