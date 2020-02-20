import {Module} from '@nestjs/common';
import {IWebModuleConfig, WebModule} from '@relate/web';
import {ConfigModule} from '@nestjs/config';

import {WindowModule} from './window';

import configuration from './configs/dev.config';

export interface IElectronModuleConfig extends IWebModuleConfig {
    defaultApp: string;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        WebModule,
        WindowModule,
    ],
    providers: [],
})
export class ElectronModule {}
