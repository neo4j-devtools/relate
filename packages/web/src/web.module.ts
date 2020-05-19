import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';

import {AppsModule} from './apps';
import {DBMSModule} from './dbms';
import {HealthModule} from './health';

export interface IWebModuleConfig {
    protocol: string;
    host: string;
    port: number;
    appRoot: string;
    healthCheckEndpoint: string;
}

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.WEB);

@Module({
    imports: [
        SystemModule,
        DBMSModule,
        AppsModule,
        HealthModule,
        ...dynamicModules,
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.graphql',
            installSubscriptionHandlers: true,
        }),
    ],
})
export class WebModule {}
