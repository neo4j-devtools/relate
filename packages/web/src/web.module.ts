import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';

import {AppsModule} from './apps';
import {DBMSModule} from './dbms';

export interface IWebModuleConfig {
    host: string;
    port: number;
    staticHTTPRoot: string;
}

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.WEB);

@Module({
    imports: [
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
