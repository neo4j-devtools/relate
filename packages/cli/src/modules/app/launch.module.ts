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
        const {environment: environmentId, principal, dbmsId, host} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!appId || !principal || !dbmsId) {
            // @todo: figure this out in combination with TTY
            throw new Error(`Not yet implemented`);
        }

        return this.systemProvider
            .getAccessToken(environment.id, dbmsId, principal)
            .then((accessToken) =>
                this.systemProvider.createAppLaunchToken(environment.id, appId, dbmsId, principal, accessToken),
            )
            .then((launchToken) =>
                Promise.all([
                    // @todo: cleanup
                    cli.open(`${host}/static/${appId}?_appLaunchToken=${launchToken}`),
                    this.utils.log(`Launching app "${appId}" with token ${launchToken}`),
                ]),
            );
    }
}
