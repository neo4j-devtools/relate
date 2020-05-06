import {NestFactory} from '@nestjs/core';
import path from 'path';

// ugly hack for allowing extensions to use our dependencies in electron
require('module').globalPaths.push(path.join(__dirname, '..', 'node_modules'));

import {ElectronModule} from './electron.module';

const PORT = 3001;
const HOST = '127.0.0.1';

NestFactory.create(ElectronModule).then((app) => {
    app.listen(PORT, HOST);
});
