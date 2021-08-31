import {NestFactory} from '@nestjs/core';
import {ConfigModule} from '@nestjs/config';
import {Module} from '@nestjs/common';
import path from 'path';

// ugly hack for allowing extensions to use our dependencies in electron
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module').globalPaths.push(path.join(__dirname, '..', 'node_modules'));

import {ElectronModule, IElectronModuleConfig} from './electron.module';
import {ELECTRON_IS_READY} from './constants';
import {WindowModule} from './window';

export {ElectronModule, IElectronModuleConfig, WindowModule};

export async function bootstrapElectronModule(env = 'dev'): Promise<void> {
    const {default: configuration} = await require(`./configs/${env}.config`);
    const config = configuration();

    // this is weird but it allows us to have global configs
    @Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
            }),
            ElectronModule.register(config),
        ],
    })
    class ServerModule {}

    const app = await NestFactory.create(ServerModule);
    const windowModule = app.get(WindowModule);

    await app.listen(config.port, config.host);
    await ELECTRON_IS_READY;

    return windowModule.createAppWindow('neo4j-browser');
}
