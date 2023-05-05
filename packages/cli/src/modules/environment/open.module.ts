import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import OpenCommand from '../../commands/environment/open';

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

    async logOrOpen(path: string): Promise<void> {
        if (this.parsed.flags.log) {
            this.utils.log(path);
        } else {
            const {openApp} = await import('open');
            openApp(path);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args} = this.parsed;
        const {environment: environmentId} = args;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        await this.logOrOpen(environment.configPath);
    }
}
