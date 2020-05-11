/* eslint-disable no-sync */

import * as path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';

import {envPaths} from './env-paths';
import {ExtensionModel, IInstalledExtension} from '../models';
import {InvalidArgumentError} from '../errors';
import {
    EXTENSION_DIR_NAME,
    EXTENSION_INDEX_HTML,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_MANIFEST,
    PACKAGE_JSON,
    EXTENSION_TYPES,
} from '../constants';

/**
 * Synchronous method, only call on process bootstrap (not inside applications)
 */
export function getInstalledExtensions(): IInstalledExtension[] {
    const installationDir = path.join(envPaths().data, EXTENSION_DIR_NAME);

    return _.compact(
        _.flatMap(_.values(EXTENSION_TYPES), (type) => {
            const dirPath = path.join(installationDir, type);

            fse.ensureDirSync(dirPath);

            const files = fse.readdirSync(dirPath);

            return _.map(files, (file): IInstalledExtension | null => {
                const fullPath = path.join(dirPath, file);

                try {
                    return mapContentsToExtension(fullPath, file);
                } catch (e) {
                    // @todo: error logging?
                    return null;
                }
            });
        }),
    );
}

function mapContentsToExtension(fullPath: string, name: string): IInstalledExtension {
    const manifestPath = path.join(fullPath, EXTENSION_MANIFEST);
    const packagePath = path.join(fullPath, PACKAGE_JSON);
    const indexHtmlPath = path.join(fullPath, EXTENSION_INDEX_HTML);
    const info = fse.lstatSync(fullPath);

    if (!info.isDirectory()) {
        throw new InvalidArgumentError('Installed extensions must be a directory');
    }

    const hasManifest = fse.pathExistsSync(manifestPath);
    const hasPackageJson = fse.pathExistsSync(packagePath);
    const hasIndexHtml = fse.pathExistsSync(indexHtmlPath);

    if (hasManifest || hasPackageJson) {
        const contents = fse.readJSONSync(hasManifest ? manifestPath : packagePath);
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
            version: '*',
            type: EXTENSION_TYPES.STATIC,
        });
    }

    throw new InvalidArgumentError('Unable to parse extension contents');
}
