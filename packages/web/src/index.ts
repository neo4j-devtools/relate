import {ConfigModule} from '@nestjs/config';
import {Module} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import fetch from 'node-fetch';

import {HealthService, IHealthInfo} from './health';
import {WebModule, IWebModuleConfig} from './web.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {json, NextFunction, Request, Response} from 'express';

export {WebModule, IWebModuleConfig, IHealthInfo};

export async function bootstrapWebModule(env = 'dev'): Promise<void> {
    const {default: configuration} = await require(`./configs/${env}.config`);
    const config = configuration();

    // this is weird but it allows us to have global configs
    @Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
            }),
            WebModule,
        ],
    })
    class ServerModule {}

    const app = await NestFactory.create<NestExpressApplication>(ServerModule, {
        cors: true,
        bodyParser: false,
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        // Don't use body parser on the REST endpoints
        // https://github.com/Urigo/SOFA/issues/1174#issuecomment-1472363676
        if (req.path.startsWith('/api')) {
            next();
            return;
        }

        json()(req, res, next);
    });

    await app.listen(config.port, config.host);
}

export async function infoWebModule(env = 'dev'): Promise<IHealthInfo> {
    // @todo: how to handle env?
    const {default: configuration} = await require(`./configs/${env}.config`);

    // this is weird but it allows us to have global configs
    @Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
            }),
            WebModule,
        ],
    })
    class ServerModule {}

    const app = await NestFactory.create(ServerModule, {
        logger: false,
    });
    const healthService = app.get(HealthService);

    return fetch(healthService.healthUrl).then((res) => {
        if (!res.ok) {
            throw new Error(`Unable to get health info`);
        }

        return res.json();
    });
}
