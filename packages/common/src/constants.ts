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
export const EXTENSION_SHA_ALGORITHM = 'sha1';
export const EXTENSION_NPM_PREFIX = '@relate-ext/';
export const EXTENSION_URL_PATH = `https://neo.jfrog.io/artifactory/api/npm/npm-local-private/${EXTENSION_NPM_PREFIX}`;

export const BOLT_DEFAULT_PORT = ':7687';

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

export type Listener<T = any> = (eventData: T) => void | Promise<void>;
export type Actor<T = any> = (eventData: T) => T | Promise<T>;

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

export enum DBMS_STATUS_FILTERS {
    STARTED = 'Neo4j is running',
    STOPPED = 'Neo4j is not running',
}

export enum DBMS_STATUS {
    STARTED = 'started',
    STOPPED = 'stopped',
}
export enum PUBLIC_ENVIRONMENT_METHODS {
    INSTALL_DBMS = 'installDbms',
    UNINSTALL_DBMS = 'uninstallDbms',
    INSTALL_EXTENSION = 'installExtension',
    UNINSTALL_EXTENSION = 'uninstallExtension',
    START_DBMSS = 'startDbmss',
    STOP_DBMSS = 'stopDbmss',
    CREATE_ACCESS_TOKEN = 'createAccessToken',
    GET_DBMS = 'getDbms',
    INFO_DBMSS = 'infoDbmss',
    LIST_DBMSS = 'listDbmss',
    LIST_DBMS_VERSIONS = 'listDbmsVersions',
    LIST_EXTENSION_VERSIONS = 'listExtensionVersions',
    UPDATE_DBMS_CONFIG = 'updateDbmsConfig',
    INSTALLED_APPS = 'listInstalledApps',
    INSTALLED_EXTENSIONS = 'listInstalledExtensions',
    APP_LAUNCH_DATA = 'appLaunchData',
}
