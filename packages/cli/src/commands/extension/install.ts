import {flags} from '@oclif/command';

import BaseCommand from '../../base.command';

import {InstallModule} from '../../modules/extension/install.module';
import {FLAGS} from '../../constants';

export default class InstallCommand extends BaseCommand {
    commandClass = InstallCommand;

    commandModule = InstallModule;

    static aliases = ['ext:install'];

    static description = 'Install a Relate extension';

    static examples = [
        '$ relate ext:install',
        '$ relate ext:install -e environment-name',
        '$ relate ext:install extension-name',
        '$ relate ext:install extension-name -V 1.0.0',
    ];

    static args = [
        {
            name: 'name',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
        version: flags.string({
            char: 'V',
            description: 'Version to install (semver), or path to tarball',
        }),
    };
}
