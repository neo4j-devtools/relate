import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {IWebModuleConfig, WebModule} from '@relate/web';
import {SystemModule, loadExtensionsFor, EXTENSION_TYPES} from '@relate/common';

import {WindowModule} from './window';

import configuration from './configs/dev.config';

export interface IElectronModuleConfig extends IWebModuleConfig {
    defaultApp: string;
}

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.ELECTRON);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        SystemModule,
        WebModule,
        WindowModule,
        ...dynamicModules,
    ],
    providers: [],
})
export class ElectronModule {}
