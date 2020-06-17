import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import ListCommand from '../../commands/extension/list';
import {getEntityDisplayName} from '../../utils/display.utils';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof ListCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environments = await this.systemProvider.listEnvironments();

        cli.table(
            environments.toArray(),
            {
                name: {get: getEntityDisplayName},
                type: {},
                active: {get: ({active}) => Boolean(active)},
                httpOrigin: {get: (val) => val.httpOrigin || ''},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
