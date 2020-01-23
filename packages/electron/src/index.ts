import {NestFactory} from '@nestjs/core';

import {ElectronModule} from './electron.module';

const PORT = 3001;
const HOST = '127.0.0.1';

NestFactory.create(ElectronModule).then((app) => {
    app.listen(PORT, HOST);
});
