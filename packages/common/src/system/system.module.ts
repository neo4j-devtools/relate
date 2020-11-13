import {Module, DynamicModule} from '@nestjs/common';

import {SystemProvider} from './system.provider';
import {loadExtensionsFor} from '../utils/extensions';
import {EXTENSION_TYPES} from '../constants';

export interface ISystemModuleConfig {
    defaultEnvironmentNameOrId?: string;
}

@Module({
    imports: [],
    exports: [SystemProvider],
    providers: [SystemProvider],
})
export class SystemModule {
    static register(config: ISystemModuleConfig = {}): DynamicModule {
        const {defaultEnvironmentNameOrId} = config;
        const systemExtensions = loadExtensionsFor(EXTENSION_TYPES.SYSTEM, defaultEnvironmentNameOrId);

        return {
            imports: [...systemExtensions],
            module: SystemModule,
            exports: [...systemExtensions],
        };
    }
}
