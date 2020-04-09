import {copy} from 'fs-extra';
import {find, includes} from 'lodash';

import {readPropertiesFile, writePropertiesFile} from './utils';
import {IPropertiesFile, INeo4jConfigDefaults, NEO4J_CONFIG_DEFAULTS} from './properties-file.constants';

export class PropertiesFile implements IPropertiesFile {
    config: Map<string, string>;

    path: string;

    defaults: INeo4jConfigDefaults;

    constructor(config: Map<string, string>, path: string, defaults: INeo4jConfigDefaults) {
        this.config = config;
        this.path = path;
        this.defaults = defaults;
    }

    public static async readFile(path: string) {
        const config = await readPropertiesFile(path);
        return new PropertiesFile(config, path, NEO4J_CONFIG_DEFAULTS);
    }

    public async set(key: string, value: string | boolean) {
        let configEntries = this.getEntries(this.config);
        configEntries = this.setEntry(configEntries, key, value);
        await this.writePropertiesFile(new Map(configEntries));
    }

    private getEntries(config: Map<string, string>): [string, string][] {
        const configEntries: any[] = [];
        for (const arr of config.entries()) {
            configEntries.push(arr);
        }
        return configEntries;
    }

    private setEntry(configEntries: [string, string][], key: string, val: string | boolean): [string, string][] {
        const entry = find(configEntries, (configEntry) => includes(configEntry[0], key));
        if (entry) {
            if (includes(entry[0], '#')) {
                entry[0] = key;
            }
            entry[1] = val.toString();
        }
        return configEntries;
    }

    public get(key: string): string {
        return this.config.get(key) || this.defaults[key];
    }

    private async writePropertiesFile(config: Map<string, string>): Promise<void> {
        this.config = config;
        await writePropertiesFile(this.path, config);
    }

    public async backupPropertiesFile(backupPath: string): Promise<void> {
        await copy(this.path, backupPath);
    }
}
