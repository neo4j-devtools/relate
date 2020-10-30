import {Inject, Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {BrowserWindow} from 'electron';
import {
    Environment,
    ENVIRONMENT_TYPES,
    emitHookEvent,
    getAppLaunchUrl,
    HOOK_EVENTS,
    NotFoundError,
    SystemModule,
    SystemProvider,
} from '@relate/common';
import fetch from 'node-fetch';

import {IElectronModuleConfig} from '../electron.module';

@Module({
    imports: [SystemModule],
})
export class WindowModule {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService<IElectronModuleConfig>,
        @Inject(SystemProvider) private readonly systemProvider: SystemProvider,
    ) {}

    async createAppWindow(appName: string): Promise<void> {
        // Create the browser window.
        const windowOptions = await emitHookEvent(HOOK_EVENTS.ELECTRON_WINDOW_OPTIONS, {
            height: 600,
            width: 800,
        });
        const mainWindow = await emitHookEvent(HOOK_EVENTS.ELECTRON_WINDOW_CREATED, new BrowserWindow(windowOptions));
        const environment = await this.systemProvider.getEnvironment();
        const httpOrigin = this.getHttpOrigin(environment);
        const appRoot = await this.getAppRoot(httpOrigin);
        const appPath = await environment.extensions.getAppPath(appName, appRoot);
        const appUrl = await getAppLaunchUrl(environment, appPath, appName);

        // and load the index.html of the app.
        mainWindow.loadURL(appUrl);
    }

    private async getAppRoot(httpOrigin: string): Promise<string> {
        const res = await fetch(`${httpOrigin}/health`);

        if (!res.ok) {
            throw new NotFoundError(`Could not connect to the @relate/web server`, [
                'If you are connecting locally, try restarting the application.',
                'If you are connecting to a remote, ensure the "@relate/web" package is installed and running.',
            ]);
        }

        const {appRoot} = await res.json();

        return appRoot;
    }

    private getHttpOrigin(environment: Environment): string {
        switch (environment.type) {
            case ENVIRONMENT_TYPES.LOCAL: {
                const protocol = this.configService.get('protocol');
                const host = this.configService.get('host');
                const port = this.configService.get('port');

                return `${protocol}${host}:${port}`;
            }

            default:
                return environment.httpOrigin;
        }
    }
}
