import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {EXTENSION_TYPES, NotFoundError, NotSupportedError, SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';
import {exec} from 'child_process';
import _ from 'lodash';

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
        const installedExtensions = await this.systemProvider.listInstalledExtensions();
        const extensionIsInstalled = _.some(
            installedExtensions,
            ({type, name}) => type === EXTENSION_TYPES.STATIC && appName === name,
        );

        if (!extensionIsInstalled) {
            // @todo: figure this out in combination with TTY
            throw new Error(`App ${appName} is not installed`);
        }

        const appUrl = await this.getAppUrl(appName);

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

    private async getAppUrl(appName: string, bail = false): Promise<string> {
        try {
            const healthInfo: any = await new Promise((resolve, reject) => {
                exec(
                    'relate-web info',
                    {
                        encoding: 'utf8',
                    },
                    (err, stdout, stderr) => {
                        if (err || stderr) {
                            reject(err || stderr);
                            return;
                        }

                        resolve(JSON.parse(stdout));
                    },
                );
            });

            return `${healthInfo.protocol}${healthInfo.host}:${healthInfo.port}${healthInfo.appRoot}/${appName}`;
        } catch (e) {
            if (!bail && _.includes(e, 'ECONNREFUSED')) {
                throw new NotFoundError(`The @relate/web server is not running`, [
                    'Run "relate-web start" and try again.',
                ]);
            }

            throw new NotSupportedError(`Unable to find the @relate/web server package`, [
                'Install the "@relate/web" package and try again.',
            ]);
        }
    }
}
