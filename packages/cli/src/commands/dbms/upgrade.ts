import {Flags} from '@oclif/core';

import BaseCommand from '../../base.command';
import {ARGS, FLAGS} from '../../constants';
import {UpgradeModule} from '../../modules/dbms/upgrade.module';

export default class UpgradeCommand extends BaseCommand {
    commandClass = UpgradeCommand;

    commandModule = UpgradeModule;

    static description = 'Upgrade an installed DBMS to a newer version';

    static examples = [
        '$ relate dbms:upgrade',
        '$ relate dbms:upgrade -e environment-name',
        'relate dbms:upgrade <dbms-id> -v 4.4.11',
    ];

    static args = [ARGS.DBMS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...FLAGS.VERSION,
        noCaching: Flags.boolean({
            default: false,
            description: 'Prevent caching of the downloaded DBMS',
        }),
        noMigration: Flags.boolean({
            default: false,
            description: 'Prevent migrating the data to new formats',
        }),
    };
}
