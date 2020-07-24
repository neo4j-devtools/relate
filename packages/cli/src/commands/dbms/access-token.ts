import {flags} from '@oclif/command';
import {NEO4J_ACCESS_TOKENS_SUPPORTED_VERSION_RANGE, NEO4J_EDITION} from '@relate/common';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {AccessTokenModule} from '../../modules/dbms/access-token.module';

export default class AccessTokenCommand extends BaseCommand {
    commandClass = AccessTokenCommand;

    commandModule = AccessTokenModule;

    // eslint-disable-next-line max-len
    static description = `Generate access token for a Neo4j ${NEO4J_ACCESS_TOKENS_SUPPORTED_VERSION_RANGE} ${NEO4J_EDITION.ENTERPRISE} DBMS`;

    static examples = [
        '$ relate dbms:access-token',
        '$ relate dbms:access-token -e environment-name',
        '$ relate dbms:access-token my-dbms',
        '$ relate dbms:access-token my-dbms -u dbms-user',
    ];

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
