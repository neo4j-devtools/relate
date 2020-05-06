import {copy} from 'fs-extra';
import {find, includes} from 'lodash';

import {readPropertiesFile, writePropertiesFile} from '../../utils';
import {IPropertiesFile, INeo4jConfigDefaults, NEO4J_CONFIG_DEFAULTS} from './properties-file.constants';

export class PropertiesFile implements IPropertiesFile {
    constructor(
        public config: Map<string, string>,
        public path: string,
        private defaults: INeo4jConfigDefaults = NEO4J_CONFIG_DEFAULTS,
    ) {}

    public static async readFile(path: string) {
        const config = await readPropertiesFile(path);
        return new PropertiesFile(config, path, NEO4J_CONFIG_DEFAULTS);
    }

    public set(key: string, value: string | boolean) {
        let configEntries = this.getEntries(this.config);
        configEntries = this.setEntry(configEntries, key, value);
        this.config = new Map(configEntries);
    }

    private getEntries(config: Map<string, string>): [string, string][] {
        return [...config.entries()];
    }

    private setEntry(configEntries: [string, string][], key: string, val: string | boolean): [string, string][] {
        const entry = find(configEntries, (configEntry) => includes(configEntry[0], key));
        if (entry) {
            if (includes(entry[0], '#')) {
                entry[0] = key;
            }
            entry[1] = val.toString();

            return configEntries;
        }

        this.config.set(key, val.toString());

        return [...this.config];
    }

    public get(key: string): string {
        return this.config.get(key) || this.defaults[key];
    }

    flush(): Promise<void> {
        return writePropertiesFile(this.path, this.config);
    }

    public async backupPropertiesFile(backupPath: string): Promise<void> {
        await copy(this.path, backupPath);
    }
}
