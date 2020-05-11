import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {IExtensionMeta, SystemModule, SystemProvider} from '@relate/common';
import _ from 'lodash';

import UninstallCommand from '../../commands/extension/uninstall';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UninstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof UninstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    onApplicationBootstrap(): Promise<void> {
        const {args} = this.parsed;
        const {name} = args;

        if (!name) {
            // @todo: figure this out in combination with TTY
            throw new Error(`Not yet implemented`);
        }

        return this.systemProvider.uninstallExtension(name).then((exts) => {
            const extFormatter = (ext: IExtensionMeta): string => `${ext.name}@${ext.version}`;

            this.utils.log(`Uninstalled ${_.join(_.map(exts, extFormatter), ', ')}`);
        });
    }
}
