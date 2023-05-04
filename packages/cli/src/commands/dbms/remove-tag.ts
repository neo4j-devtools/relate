import {Args} from '@oclif/core';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {RemoveTagModule} from '../../modules/dbms/remove-tag.module';

export default class RemoveTagCommand extends BaseCommand {
    commandClass = RemoveTagCommand;

    commandModule = RemoveTagModule;

    static description = 'Remove tag from a DBMS';

    static examples = ['$ relate dbms:remove-tag dbmsId "waiting for approval"'];

    static args = {
        ...ARGS.DBMS,
        tagName: Args.string({
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
