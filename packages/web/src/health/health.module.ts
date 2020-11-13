import {HttpAdapterHost} from '@nestjs/core';
import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {SystemModule} from '@relate/common';

import {HealthService} from './services/health.service';
import {ConfigModule} from '@nestjs/config';

@Module({
    exports: [HealthService],
    imports: [ConfigModule, SystemModule],
    providers: [HealthService],
})
export class HealthModule implements OnModuleInit {
    constructor(
        @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(HealthService) private readonly loader: HealthService,
    ) {}

    async onModuleInit(): Promise<void> {
        if (!this.httpAdapterHost) {
            return;
        }

        const {httpAdapter} = this.httpAdapterHost;

        await this.loader.register(httpAdapter);
    }
}
