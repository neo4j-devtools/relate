import {IElectronModuleConfig} from '../electron.module';

const DEFAULT_PORT = 3001;
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_STATIC_HTTP_ROOT = '/static';
const DEFAULT_APP = 'neo4j-browser';

export default (): IElectronModuleConfig => ({
    defaultApp: process.env.DEFAULT_APP || DEFAULT_APP,
    host: process.env.HOST || DEFAULT_HOST,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    staticHTTPRoot: process.env.STATIC_HTTP_ROOT || DEFAULT_STATIC_HTTP_ROOT,
});
