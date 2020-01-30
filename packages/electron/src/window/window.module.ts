import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {BrowserWindow} from 'electron';

import {IElectronModuleConfig} from '../electron.module';

import {ELECTRON_IS_READY} from '../constants';

@Module({})
export class WindowModule implements OnApplicationBootstrap {
    constructor(@Inject(ConfigService) private readonly configService: ConfigService<IElectronModuleConfig>) {}

    onApplicationBootstrap(): Promise<void> {
        return ELECTRON_IS_READY.then(() => this.createAppWindow());
    }

    createAppWindow(): void {
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
        });

        const defaultApp = this.configService.get('defaultApp');
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const staticHTTPRoot = this.configService.get('staticHTTPRoot');

        // and load the index.html of the app.
        mainWindow.loadURL(`http://${host}:${port}${staticHTTPRoot}/${defaultApp}`);
    }
}
