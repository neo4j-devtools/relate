import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {BrowserWindow} from 'electron';
import {emitHookEvent, HOOK_EVENTS} from '@relate/common';

import {IElectronModuleConfig} from '../electron.module';

import {ELECTRON_IS_READY} from '../constants';

@Module({
    imports: [],
})
export class WindowModule implements OnApplicationBootstrap {
    constructor(@Inject(ConfigService) private readonly configService: ConfigService<IElectronModuleConfig>) {}

    onApplicationBootstrap(): Promise<void> {
        return ELECTRON_IS_READY.then(() => this.createAppWindow());
    }

    async createAppWindow(): Promise<void> {
        // Create the browser window.
        const windowOptions = await emitHookEvent(HOOK_EVENTS.ELECTRON_WINDOW_OPTIONS, {
            height: 600,
            width: 800,
        });
        const mainWindow = await emitHookEvent(HOOK_EVENTS.ELECTRON_WINDOW_CREATED, new BrowserWindow(windowOptions));
        const defaultApp = 'neo4j-browser';
        const protocol = this.configService.get('protocol');
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const appRoot = this.configService.get('appRoot');

        setTimeout(() => {
            // and load the index.html of the app.
            mainWindow.loadURL(`${protocol}${host}:${port}${appRoot}/${defaultApp}`);
        }, 1000);
    }
}
