import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {SystemModule} from '@relate/common';

import {ApiTokenMiddleware} from './middleware/api-token.middleware';
import cookieParser from 'cookie-parser';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');

        consumer
            .apply(ApiTokenMiddleware)
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
}
