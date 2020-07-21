import BaseCommand from '../../base.command';

import {UninstallModule} from '../../modules/extension/uninstall.module';
import {FLAGS} from '../../constants';

export default class UninstallCommand extends BaseCommand {
    commandClass = UninstallCommand;

    commandModule = UninstallModule;

    static aliases = ['ext:uninstall'];

    static description = 'Uninstall an extension';

    static examples = [
        '$ relate ext:uninstall',
        '$ relate ext:uninstall -e environment-name',
        '$ relate ext:uninstall extension-name',
    ];

    static args = [
        {
            description: 'Name of the extension to uninstall',
            name: 'extension',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
