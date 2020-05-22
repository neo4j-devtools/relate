import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {AccessTokenModule} from '../../modules/dbms/access-token.module';
import {ARGS, FLAGS} from '../../constants';

export default class AccessTokenCommand extends BaseCommand {
    commandClass = AccessTokenCommand;

    commandModule = AccessTokenModule;

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        user: flags.string({
            char: 'u',
            description: 'Neo4j DBMS user to create the token for',
            default: 'neo4j',
        }),
    };
}
