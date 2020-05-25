import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {UninstallModule} from '../../modules/dbms/uninstall.module';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static description = 'Uninstall a Neo4j DBMS from the selected environment';

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
