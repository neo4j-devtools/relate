import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {UpgradeModule} from '../../modules/dbms/upgrade.module';

export default class UpgradeCommand extends BaseCommand {
    commandClass = UpgradeCommand;

    commandModule = UpgradeModule;

    static description = "Upgrade an installed DBMS's version";

    static examples = [
        '$ relate dbms:upgrade',
        '$ relate dbms:upgrade -e environment-name',
        'relate dbms:upgrade <dbms-id> -v 4.0.5',
    ];

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.VERSION,
        'no-caching': flags.boolean({
            default: false,
            description: 'Prevent caching of the downloaded DBMS',
        }),
    };
}
