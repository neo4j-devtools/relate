export const ACCOUNTS_DIR_NAME = 'accounts';

export enum ACCOUNT_TYPES {
    LOCAL = 'LOCAL',
}

export enum NEO4J_CONFIG_KEYS {
    DEFAULT_LISTEN_ADDRESS = 'dbms.default_listen_address',
    BOLT_LISTEN_ADDRESS = 'dbms.connector.bolt.listen_address',
}

export enum NEO4J_EDITION {
    COMMUNITY = 'community',
    ENTERPRISE = 'enterprise',
}

export enum NEO4J_ORIGIN {
    CACHED = 'cached',
    ONLINE = 'online',
}

export const NEO4J_BIN_DIR = 'bin';
export const NEO4J_BIN_FILE = process.platform === 'win32' ? 'neo4j.bat' : 'neo4j';
export const NEO4J_ADMIN_BIN_FILE = process.platform === 'win32' ? 'neo4j-admin.bat' : 'neo4j-admin';
export const NEO4J_ARCHIVE_FILE_SUFFIX = process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz';
export const NEO4J_DIST_VERSIONS_URL = 'http://dist.neo4j.org/versions/v1/neo4j-versions.json';
export const NEO4J_CONF_DIR = 'conf';
export const NEO4J_PLUGIN_DIR = 'plugins';
export const NEO4J_CERT_DIR = 'certificates';
export const NEO4J_CONF_FILE = 'neo4j.conf';
export const NEO4J_CONF_FILE_BACKUP = 'neo4j.conf-default';
export const DEFAULT_NEO4J_HOST = '127.0.0.1';
export const DEFAULT_NEO4J_BOLT_PORT = ':7687';

export const NEO4J_DISTRIBUTION_REGEX = /^neo4j-([\D]+)-([\S.-]+)-.*/;
export const NEO4J_SUPPORTED_VERSION_RANGE = '>=4.x';
export const NEO4J_JWT_ADDON_NAME = 'neo4j-jwt-addon';
export const NEO4J_JWT_ADDON_VERSION = '1.0.0-SNAPSHOT';
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
