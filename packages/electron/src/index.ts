import {NestFactory} from '@nestjs/core';
import path from 'path';

// ugly hack for allowing extensions to use our dependencies in electron
require('module').globalPaths.push(path.join(__dirname, '..', 'node_modules'));

import {ElectronModule, IElectronModuleConfig} from './electron.module';
import {ELECTRON_IS_READY} from './constants';
import {WindowModule} from './window';

export {ElectronModule, IElectronModuleConfig, WindowModule};

export async function bootstrapElectronModule(env = 'dev'): Promise<void> {
    const {default: configuration} = await require(`./configs/${env}.config`);
    const config = configuration();
    const app = await NestFactory.create(ElectronModule.register(config));
    const windowModule = app.get(WindowModule);

    await app.listen(config.port, config.host);
    await ELECTRON_IS_READY;

    return windowModule.createAppWindow('neo4j-browser');
}
