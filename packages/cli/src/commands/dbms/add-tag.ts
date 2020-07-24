import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {AddTagModule} from '../../modules/dbms/add-tag.module';

export default class AddTagCommand extends BaseCommand {
    commandClass = AddTagCommand;

    commandModule = AddTagModule;

    static description = 'Tag an existing DBMS';

    static examples = ['$ relate dbms:add-tag dbmsId "foo bar"'];

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
