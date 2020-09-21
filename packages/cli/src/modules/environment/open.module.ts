import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import OpenCommand from '../../commands/environment/open';
import {selectEnvironmentPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class OpenModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof OpenCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    logOrOpen(path: string): void {
        if (this.parsed.flags.log) {
            this.utils.log(path);
        } else {
            cli.open(path);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args} = this.parsed;

        const environmentId =
            args.environment || (await selectEnvironmentPrompt('Choose an environment to update', this.systemProvider));
        const environment = await this.systemProvider.getEnvironment(environmentId);

        this.logOrOpen(environment.configPath);
    }
}
