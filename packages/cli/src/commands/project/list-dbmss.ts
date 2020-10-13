import BaseCommand from '../../base.command';

import {FLAGS} from '../../constants';
import {ListDbmssModule} from '../../modules/project/list-dbmss.module';

export default class ListDbmssCommand extends BaseCommand {
    commandClass = ListDbmssCommand;

    commandModule = ListDbmssModule;

    static description = 'List project DBMS connections';

    static examples = [
        '$ relate project:list-dbmss',
        '$ relate project:list-dbmss -e environment-name',
        '$ relate project:list-dbmss -p my-project',
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
