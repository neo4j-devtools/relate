import {SignOptions} from 'jsonwebtoken';

export const RELATE_IS_TESTING = process.env.NODE_ENV === 'test';

export const JSON_FILE_EXTENSION = '.json';
export const DOWNLOADING_FILE_EXTENSION = '.rdownload';

export const DEFAULT_ENVIRONMENT_NAME = 'default';

export const RELATE_KNOWN_CONNECTIONS_FILE = 'known_connections';
export const DBMS_DIR_NAME = 'dbmss';
export const NEW_LINE = '\n';
export const PROPERTIES_SEPARATOR = '=';
// @todo: this should be generated when installing daedalus instance
export const RELATE_TOKEN_SALT_FILE_NAME = 'relate.secret.key';
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

export enum HOOK_EVENTS {
    ELECTRON_WINDOW_OPTIONS = 'ELECTRON_WINDOW_OPTIONS',
    ELECTRON_WINDOW_CREATED = 'ELECTRON_WINDOW_CREATED',
    NEO4J_DOWNLOAD_START = 'NEO4J_INSTALL_START',
    NEO4J_DOWNLOAD_STOP = 'NEO4J_INSTALL_STOP',
    NEO4J_EXTRACT_START = 'NEO4J_EXTRACT_START',
    NEO4J_EXTRACT_STOP = 'NEO4J_EXTRACT_STOP',
    JAVA_DOWNLOAD_START = 'JAVA_DOWNLOAD_START',
    JAVA_DOWNLOAD_STOP = 'JAVA_DOWNLOAD_STOP',
    JAVA_EXTRACT_START = 'JAVA_EXTRACT_START',
    JAVA_EXTRACT_STOP = 'JAVA_EXTRACT_STOP',
    RELATE_EXTENSION_DOWNLOAD_START = 'RELATE_EXTENSION_DOWNLOAD_START',
    RELATE_EXTENSION_DOWNLOAD_STOP = 'RELATE_EXTENSION_DOWNLOAD_STOP',
    RELATE_EXTENSION_EXTRACT_START = 'RELATE_EXTENSION_EXTRACT_START',
    RELATE_EXTENSION_EXTRACT_STOP = 'RELATE_EXTENSION_EXTRACT_STOP',
    RELATE_EXTENSION_DIRECTORY_MOVE_START = 'RELATE_EXTENSION_MOVE_START',
    RELATE_EXTENSION_DIRECTORY_MOVE_STOP = 'RELATE_EXTENSION_MOVE_STOP',
    RELATE_EXTENSION_DEPENDENCIES_INSTALL_START = 'RELATE_EXTENSION_DEPENDENCIES_INSTALL_START',
    RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP = 'RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP',
    DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS',
    RUN_QUERY_RETRY = 'RUN_QUERY_RETRY',
}

export interface IHookEventPayloads {
    [HOOK_EVENTS.RUN_QUERY_RETRY]: {query: string; params: any; retry: number};
    [key: string]: any;
}
export type Listener<E extends HOOK_EVENTS> = (eventData: IHookEventPayloads[E]) => void | Promise<void>;
export type Actor<E extends HOOK_EVENTS, T = IHookEventPayloads[E]> = (eventData: T) => T | Promise<T>;

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

export enum PUBLIC_GRAPHQL_METHODS {
    // dbmss
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
    UPDATE_DBMS_CONFIG = 'updateDbmsConfig',

    // apps
    LIST_APPS = 'listApps',
    APP_LAUNCH_DATA = 'appLaunchData',
    CREATE_APP_LAUNCH_TOKEN = 'createAppLaunchToken',

    // extensions
    LIST_EXTENSION_VERSIONS = 'listExtensionVersions',
    LIST_EXTENSIONS = 'listExtensions',

    // projects
    GET_PROJECT = 'getProject',
    LIST_PROJECTS = 'listProjects',
    INIT_PROJECT = 'initProject',
    ADD_PROJECT_DBMS = 'addProjectDbms',
    REMOVE_PROJECT_DBMS = 'removeProjectDbms',
    ADD_PROJECT_FILE = 'addProjectFile',
    REMOVE_PROJECT_FILE = 'removeProjectFile',

    // dump / import
    DB_DUMP = 'dbDump',
}

// seconds
export const CONNECTION_RETRY_STEP = RELATE_IS_TESTING ? 12 : 4;
export const MAX_CONNECTION_RETRIES = 5;

export const PROJECTS_DIR_NAME = 'projects';
export const PROJECTS_MANIFEST_FILE = 'relate.project.json';
export const PROJECTS_PREFIX = 'project-';

export enum FILTER_COMPARATORS {
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
}

export enum FILTER_CONNECTORS {
    AND = 'AND',
    OR = 'OR',
}

export const HEALTH_BASE_ENDPOINT = '/health';
export const STATIC_APP_BASE_ENDPOINT = '/static';
