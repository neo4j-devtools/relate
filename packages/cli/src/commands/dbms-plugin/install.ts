import {CliUx, Flags} from '@oclif/core';
import BaseCommand from '../../base.command';
import {ARGS, FLAGS, REQUIRED_FOR_SCRIPTS} from '../../constants';
import {InstallModule} from '../../modules/dbms-plugin/install.module';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static description = 'Install plugin on one or more Neo4j DBMSs';

    static aliases = ['plugin:install'];

    static examples = [
        '$ relate dbms-plugin:install',
        '$ relate dbms-plugin:install dbms1 --plugin apoc',
        '$ relate dbms-plugin:install dbms1 dbms2 dbms3 --plugin apoc',
        '$ relate dbms-plugin:install -e environment-name',
    ];

    static strict = false;

    static args = {...ARGS.DBMSS};

    static flags = {
        ...FLAGS.ENVIRONMENT,
        ...CliUx.ux.table.flags({except: ['csv']}),
        plugin: Flags.string({
            char: 'p',
            description: 'Name of the plugin to install',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
