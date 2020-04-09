export const NEO4J_CONFIG_DEFAULTS = {
    'dbms.directories.logs': 'logs',
    'dbms.directories.run': 'run',
    'dbms.security.auth_enabled': 'true',
};

export interface INeo4jConfigDefaults {
    [key: string]: string;
}

export interface IPropertiesFile {
    set(key: string, value: string): void;
    get(key: string): any;
    backupPropertiesFile(backupPath: string): void;
}
