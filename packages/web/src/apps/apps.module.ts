import {HttpAdapterHost} from '@nestjs/core';
import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {SystemModule} from '@relate/common';

import {AppsService} from './services/apps.service';
import {AppsResolver} from './apps.resolver';

@Module({
    imports: [SystemModule],
    providers: [AppsResolver, AppsService],
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
