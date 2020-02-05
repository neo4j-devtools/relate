import path from 'path';

import {IWebModuleConfig} from '../web.module';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_STATIC_FILE_ROOT = path.join(__dirname, '..', '..', 'public');
const DEFAULT_STATIC_HTTP_ROOT = '/apps';

export default (): IWebModuleConfig => ({
    host: process.env.HOST || DEFAULT_HOST,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    staticFileRoot: process.env.STATIC_FILE_ROOT || DEFAULT_STATIC_FILE_ROOT,
    staticHTTPRoot: process.env.STATIC_HTTP_ROOT || DEFAULT_STATIC_HTTP_ROOT,
});
