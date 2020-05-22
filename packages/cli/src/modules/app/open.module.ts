import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {Environment, NotFoundError, EXTENSION_TYPES, SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';
import _ from 'lodash';
import fetch from 'node-fetch';

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

        const appRoot = await this.getServerAppRoot(environment);
        const appPath = await environment.getAppPath(appName, appRoot);
        const appUrl = `${environment.httpOrigin}${appPath}`;

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

    private async getServerAppRoot(environment: Environment): Promise<string> {
        const res = await fetch(`${environment.httpOrigin}/health`);

        if (!res.ok) {
            throw new NotFoundError(`Could not connect to the @relate/web server`, [
                'If you are connecting locally, run "relate-web start" and try again.',
                'If you are connecting to a remote, ensure the "@relate/web" package is installed and running.',
            ]);
        }

        const {appRoot} = await res.json();

        return appRoot;
    }
}
