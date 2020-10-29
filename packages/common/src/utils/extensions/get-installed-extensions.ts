/* eslint-disable no-sync */
import * as path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import {List} from '@relate/types';

import {envPaths} from '../env-paths';
import {ExtensionModel, IInstalledExtension} from '../../models';
import {InvalidArgumentError} from '../../errors';
import {
    EXTENSION_DIR_NAME,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_MANIFEST_FILE,
    PACKAGE_JSON,
    EXTENSION_TYPES,
} from '../../constants';

/**
 * Synchronous method, only call on process bootstrap (not inside applications)
 */
export function getInstalledExtensionsSync(): List<IInstalledExtension> {
    const installationDir = path.join(envPaths().data, EXTENSION_DIR_NAME);

    fse.ensureDirSync(installationDir);

    return List.from(fse.readdirSync(installationDir))
        .mapEach((file) => {
            const fullPath = path.join(installationDir, file);

            try {
                return mapContentsToExtension(fullPath);
            } catch (e) {
                // @todo: error logging?
                return null;
            }
        })
        .compact();
}

function mapContentsToExtension(fullPath: string): IInstalledExtension {
    const manifestPath = path.join(fullPath, EXTENSION_MANIFEST_FILE);
    const packagePath = path.join(fullPath, PACKAGE_JSON);
    const info = fse.statSync(fullPath);

    if (!info.isDirectory()) {
        throw new InvalidArgumentError('Installed extensions must be a directory');
    }

    const hasPackageJson = fse.pathExistsSync(packagePath);

    if (!hasPackageJson) {
        throw new InvalidArgumentError('Unable to parse extension manifest');
    }

    const hasManifestFile = fse.pathExistsSync(manifestPath);
    const packageJson = fse.readJSONSync(hasManifestFile ? manifestPath : packagePath);
    const hasManifest = hasManifestFile || _.has(packageJson, EXTENSION_MANIFEST_KEY);
    const defaultManifest = {
        name: packageJson.name,
        type: EXTENSION_TYPES.STATIC,
        root: fullPath,
        version: packageJson.version,
        main: packageJson.main,
    };

    if (hasManifest) {
        const manifest = hasManifestFile ? packageJson : packageJson[EXTENSION_MANIFEST_KEY];

        return new ExtensionModel({
            ...defaultManifest,
            ...manifest,
        });
    }

    return new ExtensionModel(defaultManifest);
}
