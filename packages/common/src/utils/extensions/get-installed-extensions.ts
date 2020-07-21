/* eslint-disable no-sync */

import * as path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';

import {envPaths} from '../env-paths';
import {ExtensionModel, IInstalledExtension} from '../../models';
import {InvalidArgumentError} from '../../errors';
import {
    EXTENSION_DIR_NAME,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_MANIFEST,
    PACKAGE_JSON,
    EXTENSION_TYPES,
    EXTENSION_NPM_PREFIX,
} from '../../constants';

/**
 * Synchronous method, only call on process bootstrap (not inside applications)
 */
export function getInstalledExtensionsSync(): IInstalledExtension[] {
    const installationDir = path.join(envPaths().data, EXTENSION_DIR_NAME);

    return _.compact(
        _.flatMap(_.values(EXTENSION_TYPES), (type) => {
            const dirPath = path.join(installationDir, type);

            fse.ensureDirSync(dirPath);

            const files = fse.readdirSync(dirPath);

            return _.map(files, (file): IInstalledExtension | null => {
                const fullPath = path.join(dirPath, file);

                try {
                    return mapContentsToExtension(fullPath);
                } catch (e) {
                    // @todo: error logging?
                    return null;
                }
            });
        }),
    );
}

function mapContentsToExtension(fullPath: string): IInstalledExtension {
    const manifestPath = path.join(fullPath, EXTENSION_MANIFEST);
    const packagePath = path.join(fullPath, PACKAGE_JSON);
    const info = fse.statSync(fullPath);

    if (!info.isDirectory()) {
        throw new InvalidArgumentError('Installed extensions must be a directory');
    }

    const hasManifestFile = fse.pathExistsSync(manifestPath);
    const hasPackageJson = fse.pathExistsSync(packagePath);
    const contents = fse.readJSONSync(hasManifestFile ? manifestPath : packagePath);
    const hasManifest = hasManifestFile || _.has(contents, EXTENSION_MANIFEST_KEY);

    if (hasManifest) {
        const manifest = hasManifestFile ? contents : contents[EXTENSION_MANIFEST_KEY];

        return new ExtensionModel({
            ...manifest,
            name: _.replace(manifest.name, EXTENSION_NPM_PREFIX, ''),
            root: fullPath,
        });
    }

    if (hasPackageJson) {
        return new ExtensionModel({
            ...contents,
            name: _.replace(contents.name, EXTENSION_NPM_PREFIX, ''),
            root: fullPath,
            type: EXTENSION_TYPES.STATIC,
        });
    }

    throw new InvalidArgumentError('Unable to parse extension contents');
}
