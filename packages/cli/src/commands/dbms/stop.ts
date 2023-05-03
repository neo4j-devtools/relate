import {Flags} from '@oclif/core';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {StopModule} from '../../modules/dbms/stop.module';

export default class StopCommand extends BaseCommand {
    commandClass = StopCommand;

    commandModule = StopModule;

    static description = 'Stop one or more Neo4j DBMSs';

    static examples = [
        '$ relate dbms:stop',
        '$ relate dbms:stop my-dbms',
        '$ relate dbms:stop my-dbms my-other-dbms',
        '$ relate dbms:stop -e environment-name',
    ];

    static args = {...ARGS.DBMSS};

    static strict = false;

    static flags = {
        ...FLAGS.ENVIRONMENT,
        shutdown: Flags.boolean({
            description:
                'Use the shutdown procedure, if available, to stop the DBMS (needed on Windows for a graceful stop)',
            allowNo: process.platform === 'win32',
            default: process.platform === 'win32',
        }),
    };
}
