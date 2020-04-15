import {UninstallModule} from '../../modules/dbms/uninstall.module';
import BaseCommand from '../../base.command';
import {DBMS_FLAGS} from '../../constants';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static args = [{name: 'dbmsId'}];

    static strict = false;

    static flags = {
        ...DBMS_FLAGS,
    };
}
