import {SignOptions} from 'jsonwebtoken';

import {IRelateBackup} from './models';

export enum ENTITY_TYPES {
    DBMS = 'dbms',
    PROJECT = 'project',
    PROJECT_INSTALL = 'project-install',
    DB = 'db',
    EXTENSION = 'extension',
    ENVIRONMENT = 'environment',
    BACKUP = 'backup',
    DEBUG = 'debug',
}

export const RELATE_IS_TESTING = process.env.NODE_ENV === 'test';

export const JSON_FILE_EXTENSION = '.json';
export const DOWNLOADING_FILE_EXTENSION = '.rdownload';

export const BACKUP_MANIFEST_FILE = `relate.${ENTITY_TYPES.BACKUP}.json`;
export const DBMS_MANIFEST_FILE = `relate.${ENTITY_TYPES.DBMS}.json`;
export const PROJECT_MANIFEST_FILE = `relate.${ENTITY_TYPES.PROJECT}.json`;
export const PROJECT_INSTALL_MANIFEST_FILE = `relate.${ENTITY_TYPES.PROJECT_INSTALL}.json`;
export const EXTENSION_MANIFEST_FILE = `relate.${ENTITY_TYPES.EXTENSION}.json`;
export const DEBUG_FILE = `relate.${ENTITY_TYPES.DEBUG}.json`;

export const RELATE_ACCESS_TOKENS_DIR_NAME = 'access-tokens';
export const DBMS_DIR_NAME = 'dbmss';
export const BACKUPS_DIR_NAME = 'backups';
export const UPGRADE_LOGS_DIR_NAME = 'upgrade-logs';
export const PLUGINS_DIR_NAME = 'plugin';
export const PLUGIN_SOURCES_DIR_NAME = 'plugin-sources';
export const PLUGIN_VERSIONS_DIR_NAME = 'plugin-versions';
export const DEFAULT_PLUGIN_SOURCES_FILE = 'default-sources.json';
export const NEW_LINE = '\n';
export const PROPERTIES_SEPARATOR = '=';
// @todo: this should be generated when installing relate instance
export const RELATE_TOKEN_SALT_FILE_NAME = 'relate.secret.key';
export const TWENTY_FOUR_HOURS_SECONDS = 24 * 60 * 60;
export const DISCOVER_DBMS_THROTTLE_MS = 500;

export const EXTENSION_DIR_NAME = 'extensions';
export const PACKAGE_JSON = 'package.json';
export const EXTENSION_MANIFEST_KEY = 'relate';
export const EXTENSION_SHA_ALGORITHM = 'sha1';
export const RELATE_NPM_PREFIX = '@relate/';
export const EXTENSION_URL_PATH = `https://registry.npmjs.org/`;

export const BOLT_DEFAULT_PORT = ':7687';

export enum EXTENSION_TYPES {
    SYSTEM = 'SYSTEM',
    CLI = 'CLI',
    WEB = 'WEB',
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
    WILL_DOWNLOAD = 'WILL_DOWNLOAD',
    WILL_REQUEST = 'WILL_REQUEST',
    WILL_REQUEST_JSON = 'WILL_REQUEST_JSON',
    DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS',
    DOWNLOAD_START = 'DOWNLOAD_START',
    DOWNLOAD_STOP = 'DOWNLOAD_STOP',
    BACKUP_START = 'BACKUP_START',
    BACKUP_COMPLETE = 'BACKUP_COMPLETE',
    DBMS_MIGRATION_START = 'DBMS_MIGRATION_START',
    DBMS_MIGRATION_STOP = 'DBMS_MIGRATION_STOP',
    MANIFEST_READ = 'MANIFEST_READ',
    MANIFEST_WRITE = 'MANIFEST_WRITE',
    DEBUG = 'DEBUG',
    DBMS_TO_BE_ONLINE_ATTEMPTS = 'DBMS_TO_BE_ONLINE_ATTEMPTS',
}

export interface IHookEventPayloads {
    [HOOK_EVENTS.DBMS_TO_BE_ONLINE_ATTEMPTS]: {maxAttempts: number; currentAttempt: number};
    [HOOK_EVENTS.BACKUP_START]: {entityType: ENTITY_TYPES; entityId: string};
    [HOOK_EVENTS.BACKUP_COMPLETE]: {backup: IRelateBackup};
    [HOOK_EVENTS.WILL_DOWNLOAD]: {url: string; downloadFilePath: string; skip: boolean};
    [HOOK_EVENTS.WILL_REQUEST]: {url: string; response: any; skip: boolean};
    [HOOK_EVENTS.WILL_REQUEST_JSON]: {url: string; response: any; skip: boolean};
    [key: string]: any;
}
export type Listener<E extends HOOK_EVENTS> = (eventData: IHookEventPayloads[E]) => void | Promise<void>;
export type Actor<E extends HOOK_EVENTS, T = IHookEventPayloads[E]> = (eventData: T) => T | Promise<T>;

export const DEFAULT_JWT_SIGN_OPTIONS: SignOptions = {expiresIn: TWENTY_FOUR_HOURS_SECONDS};

export const AUTH_TOKEN_HEADER = 'X-Auth-Token';
export const API_TOKEN_HEADER = 'X-API-Token';
export const CLIENT_ID_HEADER = 'X-Client-Id';

export enum DBMS_STATUS_FILTERS {
    STARTED = 'Neo4j is running',
    STOPPED = 'Neo4j is not running',
}

export enum DBMS_STATUS {
    STARTED = 'started',
    STOPPED = 'stopped',
}

export enum DBMS_SERVER_STATUS {
    ONLINE = 'online',
    OFFLINE = 'offline',
    UNKNOWN = 'unknown',
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
    WATCH_DBMSS = 'watchDbmss',
    LIST_DBMSS = 'listDbmss',
    LIST_DBMS_VERSIONS = 'listDbmsVersions',
    UPDATE_DBMS_CONFIG = 'updateDbmsConfig',
    ADD_DBMS_TAGS = 'addDbmsTags',
    REMOVE_DBMS_TAGS = 'removeDbmsTags',
    SET_DBMS_METADATA = 'setDbmsMetadata',
    REMOVE_DBMS_METADATA = 'removeDbmsMetadata',
    UPGRADE_DBMS = 'upgradeDbms',
    LINK_DBMS = 'linkDbms',

    // dbs
    CREATE_DB = 'createDb',
    DROP_DB = 'dropDb',
    LIST_DBS = 'listDbs',
    DUMP_DB = 'dumpDb',
    LOAD_DB = 'loadDb',

    // dbms-plugins
    LIST_DBMS_PLUGINS = 'listDbmsPlugins',
    INSTALL_DBMS_PLUGIN = 'installDbmsPlugin',
    UNINSTALL_DBMS_PLUGIN = 'uninstallDbmsPlugin',
    LIST_DBMS_PLUGIN_SOURCES = 'listDbmsPluginSources',
    ADD_DBMS_PLUGIN_SOURCES = 'addDbmsPluginSources',
    REMOVE_DBMS_PLUGIN_SOURCES = 'removeDbmsPluginSources',

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
    ADD_PROJECT_TAGS = 'addProjectTags',
    REMOVE_PROJECT_TAGS = 'removeProjectTags',
    SET_PROJECT_METADATA = 'setProjectMetadata',
    REMOVE_PROJECT_METADATA = 'removeProjectMetadata',
    LIST_SAMPLES_PROJECTS = 'listSampleProjects',
    INSTALL_SAMPLE_PROJECTS = 'installSampleProjects',
    IMPORT_SAMPLE_DBMS = 'importSampleDbms',
}

// seconds
export const MAX_DBMS_TO_BE_ONLINE_ATTEMPTS = 60;
export const MAX_DBMS_TO_BE_STOPPED_ATTEMPTS = 120;

export const PROJECTS_DIR_NAME = 'projects';

export enum FILTER_COMPARATORS {
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
    IS_INCLUDED = 'IS_INCLUDED',
    IS_NOT_INCLUDED = 'IS_NOT_INCLUDED',
}

export enum FILTER_CONNECTORS {
    AND = 'AND',
    OR = 'OR',
}

export const HEALTH_BASE_ENDPOINT = '/health';
export const STATIC_APP_BASE_ENDPOINT = '/static';

export const BACKUP_ARCHIVE_FILE_EXTENSION = '.tgz';

export enum EXTENSION_VERIFICATION_STATUS {
    UNKNOWN = 'UNKNOWN',
    UNSIGNED = 'UNSIGNED',
    TRUSTED = 'TRUSTED',
    UNTRUSTED = 'UNTRUSTED',
    REVOKED = 'REVOKED',
}

export const RELATE_URL_PARAM_NAME = 'relateUrl';
export const RELATE_API_TOKEN_PARAM_NAME = 'relateApiToken';
export const RELATE_LAUNCH_TOKEN_PARAM_NAME = 'relateLaunchToken';
