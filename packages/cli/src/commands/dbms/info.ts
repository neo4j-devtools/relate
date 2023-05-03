import {CliUx, Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {InfoModule} from '../../modules/dbms/info.module';

export default class InfoCommand extends BaseCommand {
    commandClass = InfoCommand;

    commandModule = InfoModule;

    static description = 'Show the status of one or more Neo4j DBMSs';

    static examples = [
        '$ relate dbms:info',
        '$ relate dbms:info -e environment-name',
        '$ relate dbms:info -x',
        '$ relate dbms:info --columns=id,name --no-header --no-truncate',
        '$ relate dbms:info --sort=name',
        '$ relate dbms:info --filter=name=my-dbms --output=json',
    ];

    static args = {...ARGS.DBMSS};

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        onlineCheck: Flags.boolean({
            description: 'Check if the DBMS is online',
        }),
        ...CliUx.ux.table.flags({except: ['csv']}),
    };
}
