import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {RemoveTagModule} from '../../modules/dbms/remove-tag.module';

export default class RemoveTagCommand extends BaseCommand {
    commandClass = RemoveTagCommand;

    commandModule = RemoveTagModule;

    static description = 'Remove tag from an existing DBMS';

    static examples = ['$ relate dbms:remove-tag dbmsId "foo bar"'];

    static args = [
        ARGS.DBMS,
        {
            name: 'tagName',
            required: REQUIRED_FOR_SCRIPTS,
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
