import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {RemoveDbmsModule} from '../../modules/project/remove-dbms.module';

export default class RemoveDbmsCommand extends BaseCommand {
    commandClass = RemoveDbmsCommand;

    commandModule = RemoveDbmsModule;

    static description = 'Removes a dbms from a project';

    static examples = [
        '$ relate project:remove-dbms',
        '$ relate project:remove-dbms -e environment-name',
        '$ relate project:remove-dbms project-dbms-name',
        '$ relate project:remove-dbms project-dbms-name -p my-project',
    ];

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.PROJECT,
    };
}
