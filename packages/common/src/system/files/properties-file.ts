import {copy} from 'fs-extra';
import {findIndex, includes} from 'lodash';

import {PropertyEntries, readPropertiesFile, writePropertiesFile} from '../../utils/files';
import {IPropertiesFile, INeo4jConfigDefaults, NEO4J_CONFIG_DEFAULTS} from './properties-file.constants';

export class PropertiesFile implements IPropertiesFile {
    constructor(
        public config: PropertyEntries,
        public path: string,
        private defaults: INeo4jConfigDefaults = NEO4J_CONFIG_DEFAULTS,
    ) {}

    public static async readFile(path: string): Promise<PropertiesFile> {
        const config = await readPropertiesFile(path);
        return new PropertiesFile(config, path, NEO4J_CONFIG_DEFAULTS);
    }

    public set(key: string, value: string | boolean): void {
        this.setEntry(key, value);
    }

    private setEntry(key: string, val: string | boolean): void {
        const configEntries: PropertyEntries = [...this.config];
        const entryIndex = findIndex(configEntries, (configEntry) => includes([`#${key}`, key], configEntry[0]));

        if (entryIndex >= 0) {
            const entry = configEntries[entryIndex];

            if (includes(entry[0], '#')) {
                entry[0] = key;
            }

            entry[1] = `${val}`;

            this.config = configEntries;

            return;
        }

        this.config = [...configEntries, [key, `${val}`]];
    }

    public get(key: string): string | undefined {
        const entryIndex = findIndex(this.config, (configEntry) => key === configEntry[0]);

        if (entryIndex >= 0) {
            return this.config[entryIndex][1];
        }

        return this.defaults[key];
    }

    flush(): Promise<void> {
        return writePropertiesFile(this.path, this.config);
    }

    public async backupPropertiesFile(backupPath: string): Promise<void> {
        await copy(this.path, backupPath);
    }
}
