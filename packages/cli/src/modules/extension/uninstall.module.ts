import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

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
        const {args, flags} = this.parsed;
        const {name} = args;
        const {type, version} = flags;

        if (!name || !type) {
            // @todo: figure this out in combination with TTY
            throw new Error(`Not yet implemented`);
        }

        return this.systemProvider.uninstallExtension(name, type, version).then(() => {
            this.utils.log(name);
        });
    }
}
