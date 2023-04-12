import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {GraphQLModule, GraphQLSchemaHost} from '@nestjs/graphql';
import {HttpAdapterHost} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {envPaths, SystemModule, SystemProvider, ISystemModuleConfig} from '@relate/common';
import {Application} from 'express';
import {OpenAPI, useSofa} from 'sofa-api';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';

import {DBModule} from './entities/db';
import {DBMSModule} from './entities/dbms';
import {ProjectModule} from './entities/project';
import {AuthModule} from './auth';
import {FilesModule} from './files';
import {HealthModule} from './health';
import {fixAddProjectFilesOpenAPIDef} from './utils/open-api.utils';
import {DBMSPluginsModule} from './entities/dbms-plugins';
import {graphqlWs, subscriptionsTransportWs} from './utils/subscription.utils';
import {ApolloDriver} from '@nestjs/apollo';

export interface IWebModuleConfig extends ISystemModuleConfig {
    protocol?: string;
    host?: string;
    port?: number;
    autoSchemaFile?: string | boolean;
}

@Module({
    imports: [
        SystemModule,
        DBMSModule,
        DBMSPluginsModule,
        DBModule,
        ProjectModule,
        FilesModule,
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            useFactory: (configService: ConfigService<IWebModuleConfig>, systemProvider: SystemProvider) => ({
                playground: {
                    settings: {
                        'request.credentials': 'same-origin',
                    },
                },
                autoSchemaFile: configService.get('autoSchemaFile'),
                subscriptions: {
                    // @todo - This is temporarily enabled in development
                    // because graphql playground and apollo explorer don't yet
                    // support `graphql-ws`. It shouldn't be enabled in
                    // production because `subscriptions-transport-ws` has a bug
                    // that will allow certain connections to skip the
                    // onConnection handler, bypassing the token check.
                    'subscriptions-transport-ws':
                        process.env.NODE_ENV === 'development' ? subscriptionsTransportWs(systemProvider) : false,
                    'graphql-ws': graphqlWs(systemProvider),
                },
            }),
            imports: [SystemModule],
            inject: [ConfigService, SystemProvider],
        }),
        HealthModule,
        AuthModule,
    ],
    exports: [SystemModule],
})
export class WebModule implements OnModuleInit {
    constructor(
        @Inject(GraphQLSchemaHost) private readonly schemaHost: GraphQLSchemaHost,
        @Inject(HttpAdapterHost) private readonly httpAdapterHost: HttpAdapterHost,
    ) {}

    onModuleInit(): void {
        if (!this.httpAdapterHost) {
            return;
        }

        const {httpAdapter} = this.httpAdapterHost;
        const app: Application = httpAdapter.getInstance();
        const {schema} = this.schemaHost;
        const openApi = OpenAPI({
            schema,
            info: {
                title: 'Relate REST API',
                version: '1.0.0',
            },
        });

        // add multer to file upload endpoints
        const uploads = multer({dest: envPaths().tmp});

        app.use('/api/add-project-file', uploads.single('fileUpload'), (req, _, next) => {
            req.body = {
                ...req.body,
                fileUpload: {
                    // convert multer file object to the same shape as graphql-upload
                    ...req.file,
                    filename: req.file?.originalname,
                },
            };
            next();
        });

        // convert GraphQL API to REST using SOFA
        app.use(
            '/api',
            useSofa({
                basePath: '/api',
                schema,
                onRoute(info) {
                    openApi.addRoute(info, {
                        basePath: '/api',
                    });
                },
            }),
        );

        // add Swagger page for REST API
        const openApiDefinitions = openApi.get();
        openApiDefinitions.paths['/api/add-project-file'] = fixAddProjectFilesOpenAPIDef(
            openApiDefinitions.paths['/api/add-project-file'],
        );

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));
    }
}
