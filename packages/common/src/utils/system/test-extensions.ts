import {v4 as uuid} from 'uuid';
import path from 'path';
import fse from 'fs-extra';
import tar from 'tar';

import {envPaths} from '../env-paths';
import {IInstalledExtension} from '../../models';
import {ENTITY_TYPES, EXTENSION_DIR_NAME, EXTENSION_MANIFEST_FILE, EXTENSION_TYPES} from '../../constants';

export class TestExtensions {
    extensions: Array<IInstalledExtension | string> = [];

    constructor(private filename: string) {}

    createName(): string {
        const shortUUID = uuid().slice(0, 8);
        const name = `${shortUUID}-${path.basename(this.filename)}`;

        return name;
    }

    private async createExtension(type: EXTENSION_TYPES, cached?: boolean): Promise<IInstalledExtension> {
        const extensionPath = cached
            ? path.join(envPaths().cache, EXTENSION_DIR_NAME)
            : path.join(envPaths().data, EXTENSION_DIR_NAME);
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

        if (type === EXTENSION_TYPES.STATIC && !cached) {
            await fse.ensureDir(path.join(extensionPath, type));
            await fse.symlink(root, path.join(extensionPath, type, name), 'junction');
        }

        this.extensions.push(manifest);

        return manifest;
    }

    async cacheArchive(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        const cachePath = path.join(envPaths().cache, EXTENSION_DIR_NAME);
        const manifest = await this.createExtension(type, true);
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
        return this.createExtension(type, true);
    }

    installNew(type: EXTENSION_TYPES = EXTENSION_TYPES.STATIC): Promise<IInstalledExtension> {
        return this.createExtension(type);
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
                    path.join(envPaths().data, EXTENSION_DIR_NAME, `${ENTITY_TYPES.EXTENSION}-${ext.name}`),
                    ...Object.values(EXTENSION_TYPES).map((extType) =>
                        path.join(envPaths().data, EXTENSION_DIR_NAME, extType, ext.name),
                    ),
                ].map((p) => fse.remove(p)),
            );
        });

        await Promise.all(deleteAll);
    }
}
