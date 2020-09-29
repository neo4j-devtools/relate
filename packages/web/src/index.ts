import {NestFactory} from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config';
import fetch from 'node-fetch';

import {HealthService, IHealthInfo} from './health';
import {WebModule, IWebModuleConfig} from './web.module';

export {WebModule, IWebModuleConfig, IHealthInfo};
export {ExtensionModule} from './entities/extension';

export async function bootstrapWebModule(env = 'dev'): Promise<void> {
    const {default: configuration} = await require(`./configs/${env}.config`);
    const app = await NestFactory.create({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration],
            }),
        ],
        module: WebModule,
    });
    const config = app.get(ConfigService);

    return app.listen(config.get('port'), config.get('host'));
}

export async function infoWebModule(env = 'dev'): Promise<IHealthInfo> {
    // @todo: how to handle env?
    const {default: configuration} = await require(`./configs/${env}.config`);
    const app = await NestFactory.create(
        {
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
            ],
            module: WebModule,
        },
        {
            logger: false,
        },
    );
    const healthService = app.get(HealthService);

    return fetch(healthService.healthUrl).then((res) => {
        if (!res.ok) {
            throw new Error(`Unable to get health info`);
        }

        return res.json();
    });
}
