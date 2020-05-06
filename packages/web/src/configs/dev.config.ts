import {IWebModuleConfig} from '../web.module';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_STATIC_HTTP_ROOT = '/static';

export default (): IWebModuleConfig => ({
    host: process.env.HOST || DEFAULT_HOST,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    staticHTTPRoot: process.env.STATIC_HTTP_ROOT || DEFAULT_STATIC_HTTP_ROOT,
});
