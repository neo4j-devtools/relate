import got from 'got';
import semver from 'semver';
import {promises as fs} from 'fs';
import _ from 'lodash';
import fse from 'fs-extra';
import path from 'path';
import {List, Str} from '@relate/types';

import {
    EXTENSION_DIR_NAME,
    EXTENSION_ORIGIN,
    EXTENSION_MANIFEST_FILE,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_TYPES,
    PACKAGE_JSON,
    EXTENSION_MANIFEST_FILE_LEGACY,
    RELATE_NPM_PREFIX,
} from '../../constants';
import {EXTENSION_KEYWORD_NAME, EXTENSION_SEARCH_PATH} from '../../entities/environments';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {ExtensionModel, IInstalledExtension} from '../../models';
import {envPaths} from '../env-paths';

export interface IExtensionMeta {
    type: EXTENSION_TYPES;
    name: string;
    official: boolean;
    version: string;
    dist: string;
    manifest: IInstalledExtension;
    origin: EXTENSION_ORIGIN;
}

export const discoverExtensionDistributions = async (distributionsRoot: string): Promise<List<IExtensionMeta>> => {
    const dirFiles = List.from(await fs.readdir(distributionsRoot, {withFileTypes: true}));
    const files = await dirFiles
        .mapEach(async (dir) => {
            const stats = await fse.stat(path.join(distributionsRoot, dir.name));

            return stats.isDirectory() ? dir : null;
        })
        .unwindPromises();
    const dists = await files
        .compact()
        .mapEach((dir) => discoverExtension(path.join(distributionsRoot, dir.name)).catch(() => null))
        .unwindPromises();

    return dists.compact().filter((dist) => Boolean(dist.version === '*' || semver.valid(dist.version)));
};

export async function discoverExtension(extensionRootDir: string): Promise<IExtensionMeta> {
    const exists = await fse.pathExists(extensionRootDir);
    const dirName = path.basename(extensionRootDir);

    if (!exists) {
        throw new NotFoundError(`Extension ${dirName} not found`);
    }

    const extensionManifest = path.join(extensionRootDir, EXTENSION_MANIFEST_FILE);
    const extensionManifestLegacy = path.join(extensionRootDir, EXTENSION_MANIFEST_FILE_LEGACY);
    const hasManifest = await fse.pathExists(extensionManifest);
    const hasManifestLegacy = await fse.pathExists(extensionManifest);
    const extensionPackageJson = path.join(extensionRootDir, PACKAGE_JSON);
    const hasPackageJson = await fse.pathExists(extensionPackageJson);

    if (hasManifest || hasManifestLegacy) {
        const manifest = hasManifest
            ? await fse.readJSON(extensionManifest)
            : await fse.readJSON(extensionManifestLegacy);

        return {
            dist: extensionRootDir,
            manifest: new ExtensionModel({
                root: extensionRootDir,
                ...manifest,
            }),
            name: manifest.name,
            official: Str.from(manifest.name).startsWith(RELATE_NPM_PREFIX),
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
            official: Str.from(manifest.name).startsWith(RELATE_NPM_PREFIX),
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
            main,
            name: extensionName,
            root: extensionRootDir,
            type: EXTENSION_TYPES.STATIC,
            version,
        }),
        official: Str.from(name).startsWith(RELATE_NPM_PREFIX),
        name: extensionName,
        // @todo: whut?
        origin: EXTENSION_ORIGIN.CACHED,
        type: EXTENSION_TYPES.STATIC,
        version,
    };
}

export interface IExtensionVersion {
    name: string;
    version: string;
    official: boolean;
    origin: EXTENSION_ORIGIN;
}

export async function fetchExtensionVersions(): Promise<List<IExtensionVersion>> {
    const cached = List.from(await discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME)));

    try {
        const {objects} = await got(`${EXTENSION_SEARCH_PATH}?text=keywords:${EXTENSION_KEYWORD_NAME}`).json();

        return cached.concat(mapArtifactoryResponse(List.from<any>(objects).mapEach((obj) => obj.package)));
    } catch (e) {
        return List.from();
    }
}

function mapArtifactoryResponse(results: List<any>): List<IExtensionVersion> {
    return results
        .mapEach(({name, version}) => {
            return {
                name,
                official: Str.from(name).startsWith(RELATE_NPM_PREFIX),
                origin: EXTENSION_ORIGIN.ONLINE,
                version: `${version}`,
            };
        })
        .compact();
}
