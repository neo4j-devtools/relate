import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import APITokenCommand from '../../commands/environment/api-token';
import {inputPrompt, selectAppPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class APITokenModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof APITokenCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        const appName =
            args.appName || (await selectAppPrompt('Select an App to create an API token for', environment));
        const hostName =
            flags.hostName ||
            (await inputPrompt('Enter app host name', {
                initial: new URL(environment.httpOrigin).host,
            }));

        await environment.extensions.getAppPath(appName);

        return environment.generateAPIToken(hostName, appName, {}).then(this.utils.log);
    }
}
