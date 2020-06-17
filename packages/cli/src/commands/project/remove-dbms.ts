import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {RemoveDbmsModule} from '../../modules/project/remove-dbms.module';

export default class RemoveDbmsCommand extends BaseCommand {
    commandClass = RemoveDbmsCommand;

    commandModule = RemoveDbmsModule;

    static description = 'Removes a dbms from a project';

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
