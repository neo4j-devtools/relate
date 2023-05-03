import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {UninstallModule} from '../../modules/dbms/uninstall.module';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static description = 'Uninstall a Neo4j DBMS';

    static examples = [
        '$ relate dbms:uninstall',
        '$ relate dbms:uninstall -e environment-name',
        '$ relate dbms:uninstall my-dbms',
        '$ relate dbms:uninstall my-dbms -u dbms-user',
    ];

    static args = {...ARGS.DBMS};

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
