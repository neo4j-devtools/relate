import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import LaunchCommand from '../../commands/app/launch';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class LaunchModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof LaunchCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<any> {
        const {args, flags} = this.parsed;
        const {appId} = args;
        const {account: accountId, principal, dbmsId, host} = flags;
        const account = await this.systemProvider.getAccount(accountId);

        if (!appId || !principal || !dbmsId) {
            // @todo: figure this out in combination with TTY
            throw new Error(`Not yet implemented`);
        }

        return this.systemProvider
            .getAccessToken(account.id, dbmsId, principal)
            .then((accessToken) =>
                this.systemProvider.createAppLaunchToken(account.id, appId, dbmsId, principal, accessToken),
            )
            .then((launchToken) =>
                Promise.all([
                    // @todo: cleanup
                    cli.open(`${host}/apps/${appId}?_appLaunchToken=${launchToken}`),
                    this.utils.log(`Launching app "${appId}" with token ${launchToken}`),
                ]),
            );
    }
}
