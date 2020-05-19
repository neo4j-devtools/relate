import {HttpAdapterHost} from '@nestjs/core';
import {Inject, Module, OnModuleInit} from '@nestjs/common';

import {HealthService} from './services/health.service';

@Module({
    exports: [HealthService],
    imports: [],
    providers: [HealthService],
})
export class HealthModule implements OnModuleInit {
    constructor(
        @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(HealthService) private readonly loader: HealthService,
    ) {}

    onModuleInit(): void {
        if (!this.httpAdapterHost) {
            return;
        }

        const {httpAdapter} = this.httpAdapterHost;

        this.loader.register(httpAdapter);
    }
}
