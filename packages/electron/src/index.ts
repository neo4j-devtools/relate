import {NestFactory} from '@nestjs/core';
import path from 'path';
import {ConfigModule, ConfigService} from '@nestjs/config';

// ugly hack for allowing extensions to use our dependencies in electron
require('module').globalPaths.push(path.join(__dirname, '..', 'node_modules'));

import {ElectronModule} from './electron.module';
import {ELECTRON_IS_READY} from './constants';
import {WindowModule} from './window';

export {ElectronModule, WindowModule};

export async function bootstrapElectronModule(env = 'dev'): Promise<void> {
    const {default: configuration} = await require(`./configs/${env}.config`);
    const app = await NestFactory.create({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
            }),
        ],
        module: ElectronModule,
    });
    const config = app.get(ConfigService);
    const windowModule = app.get(WindowModule);

    await app.listen(config.get('port'), config.get('host'));
    await ELECTRON_IS_READY;

    return windowModule.createAppWindow();
}
