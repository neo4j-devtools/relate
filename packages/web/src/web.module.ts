import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';
import path from 'path';

import {AppsModule} from './apps';
import {DBMSModule} from './dbms';
import {HealthModule} from './health';
import {PATH_TO_EXECUTABLE_ROOT} from './constants';
import {AuthModule} from './auth';
import {ProjectsModule} from './projects/projects.module';
import {FilesModule} from './files';

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
        AppsModule,
        ProjectsModule,
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
