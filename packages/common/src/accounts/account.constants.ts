export const ACCOUNTS_DIR_NAME = 'accounts';

export enum ACCOUNT_TYPES {
    LOCAL = 'LOCAL',
}

export enum NEO4J_CONFIG_KEYS {
    DEFAULT_LISTEN_ADDRESS = 'dbms.default_listen_address',
    BOLT_LISTEN_ADDRESS = 'dbms.connector.bolt.listen_address',
}

export const NEO4J_BIN_DIR = 'bin';
export const NEO4J_BIN_FILE = process.platform === 'win32' ? 'neo4j.bat' : 'neo4j';
export const NEO4J_CONF_DIR = 'conf';
export const NEO4J_CONF_FILE = 'neo4j.conf';
export const DEFAULT_NEO4J_HOST = '127.0.0.1';
export const DEFAULT_NEO4J_BOLT_PORT = ':7687';
