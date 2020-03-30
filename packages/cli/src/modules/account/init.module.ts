import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider} from '@relate/common';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InitModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    onApplicationBootstrap(): Promise<void> {
        cli.action.start('Creating default account');

        return this.systemProvider
            .initInstallation()
            .then(() => cli.action.stop())
            .catch(this.utils.error);
    }
}
