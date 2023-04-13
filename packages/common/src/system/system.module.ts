import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {SystemProvider} from './system.provider';

export interface ISystemModuleConfig {
    defaultEnvironmentNameOrId?: string;
}

@Module({
    imports: [ConfigModule],
    exports: [SystemProvider],
    providers: [SystemProvider],
})
export class SystemModule {}
