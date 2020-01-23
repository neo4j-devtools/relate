import {NestFactory} from '@nestjs/core';

import {HelloService, SampleModule} from './sample';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(SampleModule);
    const service = app.select(SampleModule).get(HelloService);

    // eslint-disable-next-line no-console
    console.log(service.getGoodbye());
}

bootstrap();
