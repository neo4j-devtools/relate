import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {
    EXTENSION_TYPES,
    getAppBasePath,
    NotFoundError,
    NotSupportedError,
    SystemModule,
    SystemProvider,
} from '@relate/common';
import cli from 'cli-ux';
import {exec} from 'child_process';
import _ from 'lodash';

import OpenCommand from '../../commands/app/open';
import {isInteractive, readStdinArray} from '../../stdin';
import {selectAppPrompt} from '../../prompts';

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
        let {appName} = args;
        const {environment: environmentId, principal, dbmsId, log = false} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedExtensions = await this.systemProvider.listInstalledExtensions();
        const installedApps = _.filter(installedExtensions, ({type}) => type === EXTENSION_TYPES.STATIC);

        if (!appName) {
            if (isInteractive()) {
                appName = await selectAppPrompt('Select a DBMS to start', installedApps);
            } else {
                appName = await readStdinArray();
            }
        }
        const appIsInstalled = _.some(installedApps, ({name}) => appName === name);

        if (!appIsInstalled) {
            throw new Error(`App ${appName} is not installed`);
        }

        const appUrl = await this.getAppUrl(appName);

        if (!dbmsId) {
            return log ? this.utils.log(appUrl) : cli.open(appUrl);
        }

        const dbms = await environment.getDbms(dbmsId);

        if (!principal) {
            const launchToken = await this.systemProvider.createAppLaunchToken(environment.id, appName, dbms.id);
            const tokenUrl = `${appUrl}?_appLaunchToken=${launchToken}`;

            return log ? this.utils.log(tokenUrl) : cli.open(tokenUrl);
        }

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

    private async getAppUrl(appName: string): Promise<string> {
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

            const appRoot = `${healthInfo.protocol}${healthInfo.host}:${healthInfo.port}${healthInfo.appRoot}`;
            const appBasePath = await getAppBasePath(appName);

            return `${appRoot}${appBasePath}`;
        } catch (e) {
            if (_.includes(e, 'ECONNREFUSED')) {
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
