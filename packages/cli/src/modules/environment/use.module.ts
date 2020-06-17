import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import UseCommand from '../../commands/environment/use';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UseModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof UseCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {environment: environmentId} = this.parsed.args;
        const environment = await this.systemProvider.useEnvironment(environmentId);

        this.utils.log(`Environment "${environment.name}" is now set as active.`);
    }
}
