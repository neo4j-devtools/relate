import {NestFactory} from '@nestjs/core';
import fetch from 'node-fetch';

import {HealthService, IHealthInfo} from './health';
import {WebModule, IWebModuleConfig} from './web.module';

export {WebModule, IWebModuleConfig, IHealthInfo};
export {ExtensionModule} from './entities/extension';

export async function bootstrapWebModule(env = 'dev'): Promise<void> {
    const {default: configuration} = await require(`./configs/${env}.config`);
    const config = configuration();
    const app = await NestFactory.create(WebModule.register(config), {
        cors: true,
    });

    return app.listen(config.port, config.host);
}

export async function infoWebModule(env = 'dev'): Promise<IHealthInfo> {
    // @todo: how to handle env?
    const {default: configuration} = await require(`./configs/${env}.config`);
    const config = configuration();
    const app = await NestFactory.create(WebModule.register(config), {
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
