import {Module, DynamicModule} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {SystemProvider} from './system.provider';
import {loadExtensionsFor} from '../utils/extensions';
import {EXTENSION_TYPES} from '../constants';

export interface ISystemModuleConfig {
    defaultEnvironmentNameOrId?: string;
}

@Module({
    imports: [ConfigModule],
    exports: [SystemProvider],
    providers: [SystemProvider],
})
export class SystemModule {
    static register(config: ISystemModuleConfig = {}): DynamicModule {
        const {defaultEnvironmentNameOrId} = config;
        const systemExtensions = loadExtensionsFor(EXTENSION_TYPES.SYSTEM, defaultEnvironmentNameOrId);

        return {
            imports: [ConfigModule.forRoot({load: [() => config]}), ...systemExtensions],
            module: SystemModule,
        };
    }
}
