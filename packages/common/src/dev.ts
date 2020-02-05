import {NestFactory} from '@nestjs/core';

import {SystemModule, SystemProvider} from './system';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(SystemModule);
    const service = app.select(SystemModule).get(SystemProvider);

    service.getAccount('foo').statusDBMS('test');
}

bootstrap();
