import {IWebModuleConfig} from '../web.module';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '127.0.0.1';

export default (): IWebModuleConfig => ({
    host: process.env.HOST || DEFAULT_HOST,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    // @todo: https?
    protocol: 'http://',
});
