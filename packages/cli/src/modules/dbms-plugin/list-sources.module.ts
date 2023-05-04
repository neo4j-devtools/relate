import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {ux} from '@oclif/core';

import {SystemModule, SystemProvider} from '@relate/common';
import ListSourcesCommand from '../../commands/dbms-plugin/list-sources';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListSourcesModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof ListSourcesCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        return environment.dbmsPlugins.listSources().then((sources) => {
            ux.table(
                sources.toArray(),
                {
                    name: {},
                    homepageUrl: {
                        header: 'Homepage',
                    },
                    isOfficial: {
                        header: 'Official',
                    },
                    versionsUrl: {
                        header: 'Versions',
                        extended: true,
                    },
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
