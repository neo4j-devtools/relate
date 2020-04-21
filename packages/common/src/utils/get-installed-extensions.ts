import * as path from 'path';
import {ensureDirSync, lstatSync, pathExistsSync, readdirSync, readJSONSync} from 'fs-extra';
import {compact, flatMap, map, values} from 'lodash';

import {envPaths} from './env-paths';
import {EXTENSION_TYPES, ExtensionModel, IInstalledExtension} from '../models';
import {InvalidArgumentError} from '../errors';
import {
    EXTENSION_DIR_NAME,
    EXTENSION_INDEX_HTML,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_MANIFEST,
    PACKAGE_JSON,
} from '../constants';

/**
 * Synchronous method, only call on process bootstrap (not inside applications)
 */
export function getInstalledExtensions(): IInstalledExtension[] {
    const installationDir = path.join(envPaths().data, EXTENSION_DIR_NAME);

    return compact(
        flatMap(values(EXTENSION_TYPES), (type) => {
            const dirPath = path.join(installationDir, type);

            ensureDirSync(dirPath);

            const files = readdirSync(dirPath);

            return map(files, (file): ExtensionModel | null => {
                const fullPath = path.join(dirPath, file);

                try {
                    return mapContentsToExtension(fullPath, file);
                } catch (e) {
                    // @todo: error logging
                    return null;
                }
            });
        }),
    );
}

function mapContentsToExtension(fullPath: string, name: string): ExtensionModel {
    const manifestPath = path.join(fullPath, EXTENSION_MANIFEST);
    const packagePath = path.join(fullPath, PACKAGE_JSON);
    const indexHtmlPath = path.join(fullPath, EXTENSION_INDEX_HTML);
    const info = lstatSync(fullPath);

    if (!info.isDirectory()) {
        throw new InvalidArgumentError('Installed extensions must be a directory');
    }

    const hasManifest = pathExistsSync(manifestPath);
    const hasPackageJson = pathExistsSync(packagePath);
    const hasIndexHtml = pathExistsSync(indexHtmlPath);

    if (hasManifest || hasPackageJson) {
        const contents = readJSONSync(hasManifest ? manifestPath : packagePath);
        const manifest = hasManifest ? contents : contents[EXTENSION_MANIFEST_KEY];

        return new ExtensionModel({
            ...manifest,
            main: path.join(fullPath, manifest.main),
            root: fullPath,
        });
    }

    if (hasIndexHtml) {
        return new ExtensionModel({
            main: path.join(fullPath, EXTENSION_INDEX_HTML),
            name,
            root: fullPath,
            type: EXTENSION_TYPES.STATIC,
        });
    }

    throw new InvalidArgumentError('Unable to parse extension contents');
}
