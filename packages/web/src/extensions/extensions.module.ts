import {HttpAdapterHost} from '@nestjs/core';
import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {SystemModule} from '@relate/common';

import {AppsService} from './services/apps.service';
import {ExtensionsResolver} from './extensions.resolver';

@Module({
    imports: [SystemModule],
    providers: [ExtensionsResolver, AppsService],
})
export class ExtensionsModule implements OnModuleInit {
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
