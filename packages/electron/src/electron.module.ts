import {DynamicModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {IWebModuleConfig, WebModule} from '@relate/web';
import {loadExtensionsFor, EXTENSION_TYPES} from '@relate/common';

import {WindowModule} from './window';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IElectronModuleConfig extends IWebModuleConfig {}

@Module({
    imports: [ConfigModule, WebModule, WindowModule],
})
export class ElectronModule {
    static register(config: IElectronModuleConfig): DynamicModule {
        const {defaultEnvironmentNameOrId} = config;
        const electronExtensions = loadExtensionsFor(EXTENSION_TYPES.ELECTRON, defaultEnvironmentNameOrId);

        return {
            imports: [ConfigModule.forRoot({load: [() => config]}), WebModule.register(config), ...electronExtensions],
            module: ElectronModule,
        };
    }
}
