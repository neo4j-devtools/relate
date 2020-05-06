import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';
import {SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';

import {AppsModule} from './apps';

import {DBMSModule} from './dbms';
import configuration from './configs/dev.config';

export interface IWebModuleConfig {
    host: string;
    port: number;
    staticHTTPRoot: string;
}

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.WEB);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        SystemModule,
        DBMSModule,
        AppsModule,
        ...dynamicModules,
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.graphql',
            installSubscriptionHandlers: true,
        }),
    ],
})
export class WebModule {}
