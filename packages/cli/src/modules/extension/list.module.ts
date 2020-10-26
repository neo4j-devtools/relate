import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import InstallCommand from '../../commands/extension/install';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof InstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment: environmentId} = flags;

        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installed = await environment.extensions.list();

        cli.table(
            installed.toArray(),
            {
                name: {},
                type: {},
                official: {},
                verification: {header: 'Verified'},
                version: {},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
