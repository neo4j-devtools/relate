import {HttpAdapterHost} from '@nestjs/core';
import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {SystemModule} from '@relate/common';

import {AuthService} from './services/auth.service';

@Module({
    exports: [AuthService],
    imports: [SystemModule],
    providers: [AuthService],
})
export class AuthModule implements OnModuleInit {
    constructor(
        @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(AuthService) private readonly loader: AuthService,
    ) {}

    onModuleInit(): void {
        if (!this.httpAdapterHost) {
            return;
        }

        const {httpAdapter} = this.httpAdapterHost;

        this.loader.register(httpAdapter);
    }
}
