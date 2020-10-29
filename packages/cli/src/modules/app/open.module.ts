import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {Environment, getAppLaunchUrl, isValidUrl, NotFoundError, SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';
import _ from 'lodash';
import fetch from 'node-fetch';

import OpenCommand from '../../commands/app/open';
import {isInteractive, readStdin} from '../../stdin';
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

    logOrOpen(path: string): void {
        if (this.parsed.flags.log) {
            this.utils.log(path);
        } else {
            cli.open(path);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {appName} = args;
        const {environment: environmentId, user, dbmsId, project} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedApps = (await environment.extensions.listApps()).toArray();

        if (!installedApps.length) {
            throw new NotFoundError('No apps are installed', [
                `Run "relate extension:install <app> -V <version>" first`,
            ]);
        }

        if (!appName) {
            if (isInteractive()) {
                appName = await selectAppPrompt('Select an app to open', environment);
            } else {
                appName = await readStdin();
            }
        }
        const appIsInstalled = _.some(installedApps, ({name}) => appName === name);

        if (!appIsInstalled) {
            throw new NotFoundError(`App ${appName} is not installed`, [
                `Run "relate extension:install ${appName} -V <version>" and try again`,
            ]);
        }

        const appRoot = await this.getServerAppRoot(environment);
        const appPath = await environment.extensions.getAppPath(appName, appRoot);

        if (!appRoot && !isValidUrl(appPath)) {
            throw new NotFoundError(`Could not connect to the @relate/web server`, [
                'If you are connecting locally, run "relate-web start" and try again.',
                'If you are connecting to a remote, ensure that you are logged in',
            ]);
        }

        if (!dbmsId) {
            this.logOrOpen(await getAppLaunchUrl(environment, appPath, appName));
            return;
        }

        const dbms = await environment.dbmss.get(dbmsId);

        if (!user) {
            const launchToken = await environment.extensions.createAppLaunchToken(appName, dbms.id);
            const appUrl = await getAppLaunchUrl(environment, appPath, appName, launchToken);

            this.logOrOpen(appUrl);
            return;
        }

        const accessToken = await this.systemProvider.getAccessToken(environment.id, dbms.id, user);
        const launchToken = await environment.extensions.createAppLaunchToken(
            appName,
            dbms.id,
            user,
            accessToken,
            project,
        );
        const appUrl = await getAppLaunchUrl(environment, appPath, appName, launchToken);

        this.logOrOpen(appUrl);
    }

    private async getServerAppRoot(environment: Environment): Promise<string | undefined> {
        try {
            const res = await fetch(`${environment.httpOrigin}/health`);

            if (!res.ok) {
                return undefined;
            }

            const {appRoot} = await res.json();

            return appRoot;
        } catch (_error) {
            return undefined;
        }
    }
}
