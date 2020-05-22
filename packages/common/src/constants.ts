import {SignOptions} from 'jsonwebtoken';

export const JSON_FILE_EXTENSION = '.json';
export const DOWNLOADING_FILE_EXTENSION = '.rdownload';

export const DEFAULT_ENVIRONMENT_NAME = 'default';

export const RELATE_KNOWN_CONNECTIONS_FILE = 'known_connections';
export const DBMS_DIR_NAME = 'dbmss';
export const NEW_LINE = '\n';
export const PROPERTIES_SEPARATOR = '=';
// @todo: this should be generated when installing daedalus instance
export const JWT_INSTANCE_TOKEN_SALT = 'hello world!';
export const TWENTY_FOUR_HOURS_SECONDS = 24 * 60 * 60;

export const EXTENSION_DIR_NAME = 'extensions';
export const PACKAGE_JSON = 'package.json';
export const EXTENSION_MANIFEST = 'relate.manifest.json';
export const EXTENSION_MANIFEST_KEY = 'relate';
export const EXTENSION_INDEX_HTML = 'index.html';
export const EXTENSION_SHA_ALGORITHM = 'sha1';
export const EXTENSION_NPM_PREFIX = '@relate-ext/';
export const EXTENSION_URL_PATH = `https://neo.jfrog.io/artifactory/api/npm/npm-local-private/${EXTENSION_NPM_PREFIX}`;

export const LOCALHOST_IP_ADDRESS = '127.0.0.1';
export const BOLT_DEFAULT_PORT = ':7687';
// @todo: move these?
export const GOOGLE_AUTHENTICATION_CLIENT_ID =
    '287762628639-t40b4jbvff0qecvb3iv7bep8fosfpbal.apps.googleusercontent.com';
// According to this client_secret is not used as a secret in our case,
// so it should be fine for it to be here.
// https://developers.google.com/identity/protocols/oauth2#installed
// https://tools.ietf.org/html/rfc8252#page-12
export const GOOGLE_AUTHENTICATION_CLIENT_SECRET = '_rlHhLaiymDRVvjRwfumyN70';

export enum EXTENSION_TYPES {
    SYSTEM = 'SYSTEM',
    CLI = 'CLI',
    WEB = 'WEB',
    ELECTRON = 'ELECTRON',
    // TASK = 'TASK',
    STATIC = 'STATIC',
}

export enum EXTENSION_ORIGIN {
    CACHED = 'cached',
    ONLINE = 'online',
}

export enum DBMS_TLS_LEVEL {
    DISABLED = 'DISABLED',
    OPTIONAL = 'OPTIONAL',
    ENABLED = 'ENABLED',
}

export type Listener<T = any> = (eventData: T) => T | void;

export enum HOOK_EVENTS {
    ELECTRON_WINDOW_OPTIONS = 'ELECTRON_WINDOW_OPTIONS',
    ELECTRON_WINDOW_CREATED = 'ELECTRON_WINDOW_CREATED',
    NEO4J_DOWNLOAD_START = 'NEO4J_INSTALL_START',
    NEO4J_DOWNLOAD_STOP = 'NEO4J_INSTALL_STOP',
    JAVA_DOWNLOAD_START = 'JAVA_DOWNLOAD_START',
    JAVA_DOWNLOAD_STOP = 'JAVA_DOWNLOAD_STOP',
}

export const DEFAULT_JWT_SIGN_OPTIONS: SignOptions = {expiresIn: TWENTY_FOUR_HOURS_SECONDS};

export const AUTH_TOKEN_KEY = 'X-Auth-Token';
