import BaseCommand from '../../base.command';

import {FLAGS} from '../../constants';
import {ListDbmssModule} from '../../modules/project/list-dbmss.module';

export default class ListDbmssCommand extends BaseCommand {
    commandClass = ListDbmssCommand;

    commandModule = ListDbmssModule;

    static description = 'Lists project dbmss';

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
