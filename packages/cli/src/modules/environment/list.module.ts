import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import {ux} from '@oclif/core';

import ListCommand from '../../commands/environment/list';

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

        ux.table(
            environments.toArray(),
            {
                id: {},
                name: {},
                type: {},
                active: {get: ({isActive}) => isActive},
                httpOrigin: {get: (val) => val.httpOrigin || ''},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
