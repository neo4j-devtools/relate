import {Flags} from '@oclif/core';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {UninstallModule} from '../../modules/dbms-plugin/uninstall.module';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static description = 'Uninstall plugin from one or more Neo4j DBMSs';

    static aliases = ['plugin:uninstall'];

    static examples = [
        '$ relate dbms-plugin:uninstall',
        '$ relate dbms-plugin:uninstall dbms1 --plugin apoc',
        '$ relate dbms-plugin:uninstall dbms1 dbms2 dbms3 --plugin apoc',
        '$ relate dbms-plugin:uninstall -e environment-name',
    ];

    static strict = false;

    static args = [ARGS.DBMSS];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        plugin: Flags.string({
            char: 'p',
            description: 'Name of the plugin to uninstall',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
