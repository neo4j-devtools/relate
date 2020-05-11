import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

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

    async onApplicationBootstrap(): Promise<any> {
        const {flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        return Promise.all([
            cli.open(environment.configPath),
            this.utils.log(`Opening environment "${environment.id}"`),
        ]);
    }
}
