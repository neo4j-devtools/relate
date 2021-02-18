import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';

import {SystemModule, SystemProvider} from '@relate/common';
import UninstallCommand from '../../commands/dbms-plugin/uninstall';
import {inputPrompt, selectDbmssPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UninstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof UninstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags, argv} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        const plugin = flags.plugin || (await inputPrompt('Enter the name of the plugin to uninstall'));
        const dbmss = argv.length
            ? argv
            : await selectDbmssPrompt('Select DBMSs in which to uninstall the plugin', environment);

        await environment.dbmsPlugins.uninstall(dbmss, plugin);
    }
}
