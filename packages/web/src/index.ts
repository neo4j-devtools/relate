import {NestFactory} from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {WebModule, IWebModuleConfig} from './web.module';

export {WebModule, IWebModuleConfig};
export {AppsModule} from './apps';

export default async function bootstrapWebModule(env = 'dev'): Promise<void> {
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
