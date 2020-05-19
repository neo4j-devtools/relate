import {IElectronModuleConfig} from '../electron.module';

const DEFAULT_PORT = 3001;
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_APP_HTTP_ROOT = '/static';
const DEFAULT_HEALTH_CHECK_ENDPOINT = '/health';
const DEFAULT_APP = 'neo4j-browser';

export default (): IElectronModuleConfig => ({
    appRoot: process.env.APP_HTTP_ROOT || DEFAULT_APP_HTTP_ROOT,
    defaultApp: process.env.DEFAULT_APP || DEFAULT_APP,
    healthCheckEndpoint: process.env.HEALTH_CHECK_ENDPOINT || DEFAULT_HEALTH_CHECK_ENDPOINT,
    host: process.env.HOST || DEFAULT_HOST,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    // @todo: https?
    protocol: 'http://',
});
