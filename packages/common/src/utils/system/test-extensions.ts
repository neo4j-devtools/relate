import {v4 as uuid} from 'uuid';
import path from 'path';
import fse from 'fs-extra';
import tar from 'tar';

import {envPaths} from '../env-paths';
import {IInstalledExtension} from '../../models';
import {EXTENSION_DIR_NAME, EXTENSION_MANIFEST_FILE, EXTENSION_TYPES} from '../../constants';

export class TestExtensions {
    extensions: Array<IInstalledExtension | string> = [];

    constructor(private filename: string) {}

    createName(): string {
        const shortUUID = uuid().slice(0, 8);
        const name = `${shortUUID}-${path.basename(this.filename)}`;

        return name;
    }

    private async createExtension(type: EXTENSION_TYPES, extensionPath: string): Promise<IInstalledExtension> {
        const name = this.createName();
        const root = path.join(extensionPath, name);
        const manifest: IInstalledExtension = {
            name,
            type,
            version: '1.0.0',
            main: '',
            root,
        };
        const packageJson = {
            name,
            version: '1.0.0',
        };

        const manifestPath = path.join(root, EXTENSION_MANIFEST_FILE);
        const packageJsonPath = path.join(root, 'package.json');
        const indexPath = path.join(root, 'index.html');

        await fse.ensureFile(manifestPath);
        await fse.ensureFile(packageJsonPath);
        await fse.ensureFile(indexPath);
        await fse.writeJSON(manifestPath, manifest);
        await fse.writeJSON(packageJsonPath, packageJson);

        if (type === EXTENSION_TYPES.STATIC) {
            await fse.ensureDir(path.join(extensionPath, type));
            await fse.symlink(root, path.join(extensionPath, type, name), 'junction');
        }

        this.extensions.push(manifest);

        return manifest;
    }

    async cacheArchive(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        const cachePath = path.join(envPaths().cache, EXTENSION_DIR_NAME);
        const manifest = await this.createExtension(type, cachePath);
        const archivePath = path.join(cachePath, `${manifest.name}.tgz`);

        await tar.c(
            {
                gzip: true,
                file: archivePath,
                cwd: cachePath,
            },
            [manifest.name],
        );

        await fse.remove(path.join(cachePath, manifest.name));
        this.extensions.push(archivePath);

        return manifest;
    }

    cacheNew(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        const cachePath = path.join(envPaths().cache, EXTENSION_DIR_NAME);

        return this.createExtension(type, cachePath);
    }

    installNew(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        const installationPath = path.join(envPaths().data, EXTENSION_DIR_NAME);

        return this.createExtension(type, installationPath);
    }

    async teardown(): Promise<void> {
        const deleteAll = this.extensions.map(async (ext) => {
            if (typeof ext === 'string') {
                await fse.remove(ext);
                return;
            }

            await Promise.all(
                [
                    path.join(envPaths().cache, EXTENSION_DIR_NAME, ext.name),
                    path.join(envPaths().cache, EXTENSION_DIR_NAME, `${ext.name}@${ext.version}`),
                    path.join(envPaths().data, EXTENSION_DIR_NAME, ext.name),
                    path.join(envPaths().data, EXTENSION_DIR_NAME, `${ext.name}@${ext.version}`),
                ].map((p) => fse.remove(p)),
            );
        });

        await Promise.all(deleteAll);
    }
}
