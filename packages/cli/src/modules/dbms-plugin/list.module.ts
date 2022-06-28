import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {CliUx} from '@oclif/core';

import {SystemModule, SystemProvider} from '@relate/common';
import ListCommand from '../../commands/dbms-plugin/list';
import {selectDbmsPrompt} from '../../prompts';

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
        const {flags, args} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        const dbmsId = args.dbms || (await selectDbmsPrompt('Select a DBMS to list plugins from', environment));

        return environment.dbmsPlugins.list(dbmsId).then((plugins) => {
            CliUx.ux.table(
                plugins.toArray(),
                {
                    name: {},
                    version: {
                        get: (p) => p.version.version,
                    },
                    isOfficial: {
                        header: 'Official',
                    },
                    homepageUrl: {
                        header: 'Homepage',
                    },
                    downloadUrl: {
                        get: (p) => p.version.downloadUrl,
                        extended: true,
                        header: 'Download',
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
