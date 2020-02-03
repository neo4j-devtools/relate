import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';

import {HelloModule} from './hello';
import {AppsModule} from './apps';

import configuration from './configs/dev.config';
import {RecipesModule} from './recipes/recipes.module';

export interface IWebModuleConfig {
    host: string;
    port: number;
    staticFileRoot: string;
    staticHTTPRoot: string;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        HelloModule,
        RecipesModule,
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.graphql',
            installSubscriptionHandlers: true,
        }),
        AppsModule,
    ],
})
export class WebModule {}
