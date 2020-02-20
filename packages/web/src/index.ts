import {NestFactory} from '@nestjs/core';

import {WebModule, IWebModuleConfig} from './web.module';
import {ConfigService} from '@nestjs/config';

export {WebModule, IWebModuleConfig};
export {AppsModule} from './apps';

export default async function bootstrapWebModule(): Promise<void> {
    const app = await NestFactory.create(WebModule);
    const config = app.get(ConfigService);

    return app.listen(config.get('port'), config.get('host'));
}
