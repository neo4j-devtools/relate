import {UninstallModule} from '../../modules/dbms/uninstall.module';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
