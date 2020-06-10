import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {AccessTokenModule} from '../../modules/dbms/access-token.module';

export default class AccessTokenCommand extends BaseCommand {
    commandClass = AccessTokenCommand;

    commandModule = AccessTokenModule;

    static description = 'Generate access token for a Neo4j DBMS';

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        user: flags.string({
            char: 'u',
            default: 'neo4j',
            description: 'Neo4j DBMS user to create the token for',
        }),
    };
}
