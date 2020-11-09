/* eslint-disable no-sync */
import * as path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import {List} from '@relate/types';

import {envPaths} from '../env-paths';
import {EnvironmentConfigModel, ExtensionModel, IInstalledExtension} from '../../models';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {
    EXTENSION_DIR_NAME,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_MANIFEST_FILE,
    PACKAGE_JSON,
    EXTENSION_TYPES,
    RELATE_DEFAULT_ENVIRONMENT,
    ENTITY_TYPES,
} from '../../constants';
import {ENVIRONMENTS_DIR_NAME} from '../../entities/environments';

/**
 * Synchronous method, only call on process bootstrap (not inside applications)
 */
export function getInstalledExtensionsSync(nameOrId?: string): List<IInstalledExtension> {
    const env = resolveEnvironmentSync(nameOrId);
    const dataDir = env.relateDataPath || path.join(envPaths().data, `${ENTITY_TYPES.ENVIRONMENT}-${env.id}`);
    const installationDir = path.join(dataDir, EXTENSION_DIR_NAME);

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

function resolveEnvironmentSync(nameOrId = RELATE_DEFAULT_ENVIRONMENT): EnvironmentConfigModel {
    const environmentsConfig = path.join(envPaths().config, ENVIRONMENTS_DIR_NAME);
    const configs = List.from(fse.readdirSync(environmentsConfig))
        .filter((name) => name.endsWith('.json'))
        .mapEach((name) => {
            const configPath = path.join(environmentsConfig, name);
            try {
                const config = fse.readJSONSync(configPath);
                return new EnvironmentConfigModel({
                    ...config,
                    configPath,
                });
            } catch (error) {
                return null;
            }
        })
        .compact();

    const resolvedConfig = configs.find(({name, id}) => name === nameOrId || id === nameOrId);
    const activeConfig = configs.find(({active}) => Boolean(active));

    return resolvedConfig
        .switchMap((c) => (nameOrId ? c : activeConfig))
        .getOrElse(() => {
            throw new NotFoundError(`Unable to find environment: ${nameOrId} or an active environment`);
        });
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
