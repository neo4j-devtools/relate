import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {ux} from '@oclif/core';

import {SystemModule, SystemProvider} from '@relate/common';
import ListCommand from '../../commands/backup/list';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof ListCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        return environment.backups.list().then((backups) => {
            ux.table(
                backups.filter(({entityType}) => (flags.type ? flags.type === entityType : true)).toArray(),
                {
                    id: {},
                    entityType: {},
                    entityId: {},
                    created: {},
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
