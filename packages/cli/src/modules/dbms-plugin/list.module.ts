import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

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
            cli.table(
                plugins.toArray(),
                {
                    name: {},
                    homepageUrl: {},
                    version: {},
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
