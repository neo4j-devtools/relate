import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';
import path from 'path';

import {ExtensionModule} from './entities/extension';
import {DBModule} from './entities/db';
import {DBMSModule} from './entities/dbms';
import {ProjectModule} from './entities/project';
import {AuthModule} from './auth';
import {FilesModule} from './files';
import {HealthModule} from './health';
import {PATH_TO_EXECUTABLE_ROOT} from './constants';

export interface IWebModuleConfig {
    protocol: string;
    host: string;
    port: number;
}

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.WEB);

@Module({
    imports: [
        SystemModule,
        DBMSModule,
        DBModule,
        ExtensionModule,
        ProjectModule,
        FilesModule,
        HealthModule,
        ...dynamicModules,
        GraphQLModule.forRoot({
            autoSchemaFile: path.join(PATH_TO_EXECUTABLE_ROOT, 'schema.graphql'),
            installSubscriptionHandlers: true,
            playground: {
                settings: {
                    'request.credentials': 'same-origin',
                },
            },
        }),
        AuthModule,
    ],
})
export class WebModule {}
