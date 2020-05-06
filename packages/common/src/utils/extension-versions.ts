import {promises as fs} from 'fs';
import fse from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import semver from 'semver';

import {EXTENSION_MANIFEST, EXTENSION_TYPES} from '../constants';

export enum EXTENSION_ORIGIN {
    CACHED = 'cached',
    ONLINE = 'online',
}

export interface IExtensionVersion {
    type: EXTENSION_TYPES;
    name: string;
    version: string;
    dist: string;
    origin: EXTENSION_ORIGIN;
}

export const discoverExtensionDistributions = async (distributionsRoot: string): Promise<IExtensionVersion[]> => {
    const files = await fs.readdir(distributionsRoot, {withFileTypes: true});
    const dirs = _.filter(files, (file) => file.isDirectory());
    const distPromises: Promise<IExtensionVersion>[] = _.map(dirs, (dir) =>
        discoverExtension(path.join(distributionsRoot, dir.name)),
    );

    // Typescript won't understand that I'm trying to filter out null values.
    const notNull = <TValue>(value: TValue | null | undefined): value is TValue => {
        return value !== null && value !== undefined;
    };
    const dists = _.filter(await Promise.all(distPromises), notNull);

    return dists.filter((dist) => dist.version === '*' || semver.valid(dist.version));
};

export async function discoverExtension(extensionRootDir: string) {
    const dirName = path.basename(extensionRootDir);
    const extensionManifest = path.join(extensionRootDir, EXTENSION_MANIFEST);
    const hasManifest = await fse.pathExists(extensionManifest);

    if (hasManifest) {
        const manifest = await fse.readJSON(extensionManifest);

        return {
            dist: extensionRootDir,
            name: manifest.name,
            origin: EXTENSION_ORIGIN.CACHED,
            type: manifest.type,
            version: manifest.version,
        };
    }

    // @todo: whut?
    return {
        dist: extensionRootDir,
        name: dirName,
        origin: EXTENSION_ORIGIN.CACHED,
        type: EXTENSION_TYPES.STATIC,
        version: '*',
    };
}
