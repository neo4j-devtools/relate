import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import OpenCommand from '../../commands/app/open';

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
        const {args, flags} = this.parsed;
        const {appName} = args;
        const {environment: environmentId, principal, dbmsId, log = false} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const appUrl = await environment.getAppUrl(appName);

        if (!appName) {
            // @todo: figure this out in combination with TTY
            throw new Error(`App must be specified`);
        }

        if (!principal || !dbmsId) {
            return log ? this.utils.log(appUrl) : cli.open(appUrl);
        }

        const dbms = await environment.getDbms(dbmsId);

        return this.systemProvider
            .getAccessToken(environment.id, dbms.id, principal)
            .then((accessToken) =>
                this.systemProvider.createAppLaunchToken(environment.id, appName, dbms.id, principal, accessToken),
            )
            .then((launchToken) => {
                const tokenUrl = `${appUrl}?_appLaunchToken=${launchToken}`;

                return log ? this.utils.log(tokenUrl) : cli.open(tokenUrl);
            });
    }
}
