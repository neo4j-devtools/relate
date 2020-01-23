import {HttpAdapterHost} from '@nestjs/core';
import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {AppsService} from './services/apps.service';

@Module({
    imports: [ConfigModule],
    providers: [AppsService, ConfigService],
})
export class AppsModule implements OnModuleInit {
    constructor(
        @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(AppsService) private readonly loader: AppsService,
    ) {}

    onModuleInit(): void {
        if (!this.httpAdapterHost) {
            return;
        }

        const {httpAdapter} = this.httpAdapterHost;

        this.loader.register(httpAdapter);
    }
}
