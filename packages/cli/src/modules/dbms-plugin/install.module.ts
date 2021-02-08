import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider} from '@relate/common';
import InstallCommand from '../../commands/dbms-plugin/install';
import {inputPrompt, selectDbmssPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof InstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags, argv} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        const plugin = flags.plugin || (await inputPrompt('Enter the name of the plugin to install'));
        const dbmss = argv || (await selectDbmssPrompt('Select DBMSs in which to install the plugin', environment));

        return environment.dbmsPlugins.install(dbmss, plugin).then((plugins) => {
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
