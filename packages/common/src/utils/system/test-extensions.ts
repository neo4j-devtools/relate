import {v4 as uuid} from 'uuid';
import path from 'path';
import fse from 'fs-extra';

import {envPaths} from '../env-paths';
import {IInstalledExtension} from '../../models';
import {EXTENSION_DIR_NAME, EXTENSION_TYPES, EXTENSION_MANIFEST} from '../../constants';

export class TestExtensions {
    extensions: IInstalledExtension[] = [];

    constructor(private filename: string) {}

    createName(): string {
        const shortUUID = uuid().slice(0, 8);
        const name = `${shortUUID}-${path.basename(this.filename)}`;

        return name;
    }

    private async createExtension(type: EXTENSION_TYPES, extensionPath: string): Promise<IInstalledExtension> {
        const name = this.createName();
        const manifest: IInstalledExtension = {
            name,
            type,
            version: '1.0.0',
            main: '',
            root: '',
        };

        const manifestPath = path.join(extensionPath, name, EXTENSION_MANIFEST);
        const indexPath = path.join(extensionPath, name, 'index.html');
        await fse.ensureFile(manifestPath);
        await fse.ensureFile(indexPath);
        await fse.writeJSON(manifestPath, manifest);

        this.extensions.push(manifest);
        return manifest;
    }

    cacheNew(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        const cachePath = path.join(envPaths().cache, EXTENSION_DIR_NAME);

        return this.createExtension(type, cachePath);
    }

    installNew(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        const installationPath = path.join(envPaths().data, EXTENSION_DIR_NAME, type);

        return this.createExtension(type, installationPath);
    }

    async teardown(): Promise<void> {
        const deleteAll = this.extensions.map(async (ext) => {
            const cachePath = path.join(envPaths().cache, EXTENSION_DIR_NAME, ext.name);
            const dataPath = path.join(envPaths().data, EXTENSION_DIR_NAME, ext.type, ext.name);

            await fse.remove(cachePath);
            await fse.remove(dataPath);
        });

        await Promise.all(deleteAll);
    }
}
