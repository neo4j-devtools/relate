import {EXTENSION_URL_PATH} from '../../constants';

export const ENVIRONMENTS_DIR_NAME = 'environments';
export const RUNTIME_DIR_NAME = 'runtime';

export enum ENVIRONMENT_TYPES {
    LOCAL = 'LOCAL',
}

export enum NEO4J_CONFIG_KEYS {
    DEFAULT_LISTEN_ADDRESS = 'dbms.default_listen_address',
    BOLT_LISTEN_ADDRESS = 'dbms.connector.bolt.listen_address',
    BOLT_CONNECTOR = 'dbms.connector.bolt',
    HTTP_CONNECTOR = 'dbms.connector.http',
    HTTPS_CONNECTOR = 'dbms.connector.https',
    ENABLED = '.enabled',
    LISTEN_ADDRESS = '.listen_address',
}

export enum NEO4J_EDITION {
    COMMUNITY = 'community',
    ENTERPRISE = 'enterprise',
}

export enum NEO4J_ORIGIN {
    CACHED = 'cached',
    ONLINE = 'online',
    LIMITED = 'limited',
}

export enum ZULU_JAVA_VERSION {
    JAVA_11 = '11.54.25-ca-jdk11.0.14.1',
    JAVA_17 = '17.34.19-ca-jdk17.0.3',
}

export const ZULU_JAVA_DOWNLOAD_URL = 'https://cdn.azul.com/zulu/bin/';

export const NEO4J_BIN_DIR = 'bin';
export const NEO4J_BIN_FILE = process.platform === 'win32' ? 'neo4j.bat' : 'neo4j';
export const NEO4J_ADMIN_BIN_FILE = process.platform === 'win32' ? 'neo4j-admin.bat' : 'neo4j-admin';
export const NEO4J_PLUGIN_SOURCES_URL =
    'https://s3-eu-west-1.amazonaws.com/dist.neo4j.org/relate/official-plugin-sources.json';
export const NEO4J_DIST_VERSIONS_URL = 'https://dist.neo4j.org/versions/v1/neo4j-versions.json';
export const NEO4J_DIST_LIMITED_VERSIONS_URL = 'https://dist.neo4j.org/versions/v1/neo4j-limited-versions.json';
export const NEO4J_CONF_DIR = 'conf';
export const NEO4J_LOGS_DIR = 'logs';
export const NEO4J_DATA_DIR = 'data';
export const NEO4J_IMPORT_DIR = 'import';
export const NEO4J_RUN_DIR = 'run';
export const NEO4J_LIB_DIR = 'lib';
export const NEO4J_PLUGIN_DIR = 'plugins';
export const NEO4J_PLUGINS_PRE_UPGRADE_DIR = 'plugins-pre-upgrade';
export const NEO4J_CERT_DIR = 'certificates';
export const NEO4J_LOG_FILE = 'neo4j.log';
export const NEO4J_RELATE_PID_FILE = 'neo4j-relate.pid';
export const NEO4J_CONF_FILE = 'neo4j.conf';
export const NEO4J_CONF_FILE_BACKUP = 'neo4j.conf-default';
export const LOCALHOST_IP_ADDRESS = '127.0.0.1';
export const DEFAULT_ENVIRONMENT_HTTP_ORIGIN = `http://${LOCALHOST_IP_ADDRESS}:3000`;
export const DEFAULT_NEO4J_BOLT_PORT = ':7687';
export const DEFAULT_NEO4J_HTTP_PORT = ':7474';
export const DEFAULT_NEO4J_HTTPS_PORT = ':7473';
export const CYPHER_SHELL_BIN_FILE = process.platform === 'win32' ? 'cypher-shell.bat' : 'cypher-shell';

export const NEO4J_DISTRIBUTION_REGEX = /^neo4j-([\D]+)-([\S.-]+)-.*/;
export const NEO4J_VERSION_5X = '>=5.0';
export const NEO4J_SUPPORTED_VERSION_RANGE = '>=3.4';
export const NEO4J_ACCESS_TOKEN_SUPPORT_VERSION_RANGE = '>=4.x';
export const NEO4J_DRIVER_MULTI_DB_SUPPORT_VERSION_RANGE = '>=4.1';
export const NEO4J_JWT_ADDON_NAME = 'neo4j-jwt-addon';
export const NEO4J_JWT_ADDON_VERSION = '1.0.1';
export const NEO4J_JWT_CONF_FILE = 'jwt-auth-addon.conf';
export const NEO4J_SHA_ALGORITHM = 'sha256';

export const NEO4J_JWT_CERT_BIT_LENGTH = 2048;
export const NEO4J_JWT_CERT_VALIDITY_YEARS = 30;
export const NEO4J_JWT_CERT_ATTRS = [
    {
        name: 'commonName',
        value: 'neo4j.com',
    },
    {
        name: 'countryName',
        value: 'SE',
    },
    {
        name: 'organizationName',
        value: '@relate',
    },
    {
        shortName: 'OU',
        value: 'JWT Auth',
    },
];

export const EXTENSION_SEARCH_PATH = `${EXTENSION_URL_PATH}-/v1/search`;
export const EXTENSION_KEYWORD_NAME = 'neo4j-relate-extension';
