import {HttpAdapterHost} from '@nestjs/core';
import {Inject, MiddlewareConsumer, Module, NestModule, OnModuleInit, RequestMethod} from '@nestjs/common';
import {SystemModule} from '@relate/common';

import {AuthService} from './services/auth.service';
import {ApiTokenMiddleware} from './middleware/api-token.middleware';
import {AuthTokenMiddleware} from './middleware/auth-token.middleware';
import cookieParser from 'cookie-parser';

@Module({
    exports: [AuthService],
    imports: [SystemModule],
    providers: [AuthService],
})
export class AuthModule implements OnModuleInit, NestModule {
    constructor(
        @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(AuthService) private readonly loader: AuthService,
    ) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');

        consumer
            .apply(ApiTokenMiddleware, AuthTokenMiddleware)
            .exclude(
                {
                    path: '/graphql',
                    method: RequestMethod.GET,
                },
                {
                    path: '/api-docs',
                    method: RequestMethod.GET,
                },
            )
            .forRoutes('*');
    }

    onModuleInit(): void {
        if (!this.httpAdapterHost) {
            return;
        }

        const {httpAdapter} = this.httpAdapterHost;

        this.loader.register(httpAdapter);
    }
}
