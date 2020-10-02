import {Inject, Module, OnModuleInit} from '@nestjs/common';
import {GraphQLModule, GraphQLSchemaHost} from '@nestjs/graphql';
import {envPaths, SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';
import {HttpAdapterHost} from '@nestjs/core';
import {Application} from 'express';
import useSofa, {OpenAPI} from 'sofa-api';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';

import {ExtensionModule} from './entities/extension';
import {DBModule} from './entities/db';
import {DBMSModule} from './entities/dbms';
import {ProjectModule} from './entities/project';
import {AuthModule} from './auth';
import {FilesModule} from './files';
import {HealthModule} from './health';
import {fixAddProjectFilesOpenAPIDef} from './utils/open-api.utils';

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
            autoSchemaFile: true,
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
                    filename: req.file.originalname,
                },
            };
            next();
        });

        // convert GraphQL API to REST using SOFA
        app.use(
            '/api',
            useSofa({
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
