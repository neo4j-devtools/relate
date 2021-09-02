import {Module} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import fetch from 'node-fetch';
import {ConfigModule} from '@relate/common';

import {HealthService, IHealthInfo} from './health';
import {WebModule, IWebModuleConfig} from './web.module';

export {WebModule, IWebModuleConfig, IHealthInfo};
export {ExtensionModule} from './entities/extension';

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
            WebModule.register(config),
        ],
    })
    class ServerModule {}

    const app = await NestFactory.create(ServerModule, {
        cors: true,
    });

    return app.listen(config.port, config.host);
}

export async function infoWebModule(env = 'dev'): Promise<IHealthInfo> {
    // @todo: how to handle env?
    const {default: configuration} = await require(`./configs/${env}.config`);
    const config = configuration();

    // this is weird but it allows us to have global configs
    @Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
            }),
            WebModule.register(config),
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
