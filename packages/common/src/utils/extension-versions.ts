import {promises as fs} from 'fs';
import fse from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import semver from 'semver';

import {
    EXTENSION_MANIFEST,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_ORIGIN,
    EXTENSION_TYPES,
    PACKAGE_JSON,
} from '../constants';
import {InvalidArgumentError, NotFoundError} from '../errors';
import {ExtensionModel, IInstalledExtension} from '../models';

export interface IExtensionMeta {
    type: EXTENSION_TYPES;
    name: string;
    version: string;
    dist: string;
    manifest: IInstalledExtension;
    origin: EXTENSION_ORIGIN;
}

export const discoverExtensionDistributions = async (distributionsRoot: string): Promise<IExtensionMeta[]> => {
    const files = await fs.readdir(distributionsRoot, {withFileTypes: true});
    const dirs = _.filter(files, (file) => file.isDirectory());
    const distPromises: Promise<IExtensionMeta | null>[] = _.map(dirs, (dir) =>
        discoverExtension(path.join(distributionsRoot, dir.name)).catch(() => null),
    );
    const dists = _.compact(await Promise.all(distPromises));

    return dists.filter((dist) => dist.version === '*' || semver.valid(dist.version));
};

export async function discoverExtension(extensionRootDir: string): Promise<IExtensionMeta> {
    const exists = await fse.pathExists(extensionRootDir);
    const dirName = path.basename(extensionRootDir);

    if (!exists) {
        throw new NotFoundError(`Extension ${dirName} not found`);
    }

    const extensionManifest = path.join(extensionRootDir, EXTENSION_MANIFEST);
    const hasManifest = await fse.pathExists(extensionManifest);
    const extensionPackageJson = path.join(extensionRootDir, PACKAGE_JSON);
    const hasPackageJson = await fse.pathExists(extensionPackageJson);

    if (hasManifest) {
        const manifest = await fse.readJSON(extensionManifest);

        return {
            dist: extensionRootDir,
            manifest: new ExtensionModel({
                root: extensionRootDir,
                ...manifest,
            }),
            name: manifest.name,
            // @todo: whut?
            origin: EXTENSION_ORIGIN.CACHED,
            type: manifest.type,
            version: manifest.version,
        };
    }

    if (!hasPackageJson) {
        throw new InvalidArgumentError(`${dirName} contains no valid manifest`);
    }

    const packageJson = await fse.readJSON(extensionPackageJson);

    if (_.has(packageJson, EXTENSION_MANIFEST_KEY)) {
        const manifest = new ExtensionModel({
            root: extensionRootDir,
            ...packageJson[EXTENSION_MANIFEST_KEY],
        });

        return {
            dist: extensionRootDir,
            manifest,
            name: manifest.name,
            // @todo: whut?
            origin: EXTENSION_ORIGIN.CACHED,
            type: manifest.type,
            version: manifest.version,
        };
    }

    const {name, main = '.', version} = packageJson;
    const extensionName = name.split(path.sep)[1] || name;

    return {
        dist: extensionRootDir,
        manifest: new ExtensionModel({
            main: path.join(extensionRootDir, main),
            name: extensionName,
            root: extensionRootDir,
            type: EXTENSION_TYPES.STATIC,
            version,
        }),
        name: extensionName,
        // @todo: whut?
        origin: EXTENSION_ORIGIN.CACHED,
        type: EXTENSION_TYPES.STATIC,
        version,
    };
}
