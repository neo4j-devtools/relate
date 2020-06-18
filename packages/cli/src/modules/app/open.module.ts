import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {Environment, NotFoundError, SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';
import _ from 'lodash';
import fetch, {Response} from 'node-fetch';

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
        const {environment: environmentId, user, dbmsId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedApps = (await environment.extensions.listApps()).toArray();

        if (!installedApps.length) {
            throw new NotFoundError('No apps are installed', [
                `Run "relate extension:install <app> -V <version>" first`,
            ]);
        }

        if (!appName) {
            if (isInteractive()) {
                appName = await selectAppPrompt('Select a DBMS to start', installedApps);
            } else {
                appName = await readStdinArray();
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
        const appUrl = `${environment.httpOrigin}${appPath}`;

        if (!dbmsId) {
            this.logOrOpen(appUrl);
            return;
        }

        const dbms = await environment.dbmss.get(dbmsId);

        if (!user) {
            const launchToken = await environment.extensions.createAppLaunchToken(environment.id, appName, dbms.id);
            const tokenUrl = `${appUrl}?_appLaunchToken=${launchToken}`;

            this.logOrOpen(tokenUrl);
            return;
        }

        const accessToken = await this.systemProvider.getAccessToken(environment.id, dbms.id, user);
        const launchToken = await environment.extensions.createAppLaunchToken(appName, dbms.id, user, accessToken);

        const tokenUrl = `${appUrl}?_appLaunchToken=${launchToken}`;
        this.logOrOpen(tokenUrl);
    }

    private async getServerAppRoot(environment: Environment): Promise<string> {
        let res: Response;

        const error = new NotFoundError(`Could not connect to the @relate/web server`, [
            'If you are connecting locally, run "relate-web start" and try again.',
            'If you are connecting to a remote, ensure that you are logged in',
        ]);

        try {
            res = await fetch(`${environment.httpOrigin}/health`);

            if (!res.ok) {
                throw error;
            }
        } catch (_error) {
            throw error;
        }

        const {appRoot} = await res.json();

        return appRoot;
    }
}
