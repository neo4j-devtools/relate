import got from 'got';
import semver from 'semver';
import {promises as fs} from 'fs';
import _ from 'lodash';
import fse from 'fs-extra';
import path from 'path';
import {List, None, Str} from '@relate/types';

import {
    EXTENSION_DIR_NAME,
    EXTENSION_NPM_PREFIX,
    EXTENSION_ORIGIN,
    EXTENSION_MANIFEST,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_TYPES,
    PACKAGE_JSON,
} from '../../constants';
import {
    EXTENSION_REPO_NAME,
    EXTENSION_SEARCH_PATH,
    JFROG_PRIVATE_REGISTRY_PASSWORD,
    JFROG_PRIVATE_REGISTRY_USERNAME,
} from '../../environments';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {ExtensionModel, IInstalledExtension} from '../../models';
import {envPaths} from '../env-paths';

export interface IExtensionMeta {
    type: EXTENSION_TYPES;
    name: string;
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
            name: _.replace(manifest.name, EXTENSION_NPM_PREFIX, ''),
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
            name: _.replace(manifest.name, EXTENSION_NPM_PREFIX, ''),
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
        name: _.replace(extensionName, EXTENSION_NPM_PREFIX, ''),
        // @todo: whut?
        origin: EXTENSION_ORIGIN.CACHED,
        type: EXTENSION_TYPES.STATIC,
        version,
    };
}

export interface IExtensionVersion {
    name: string;
    version: string;
    origin: EXTENSION_ORIGIN;
}

export async function fetchExtensionVersions(): Promise<List<IExtensionVersion>> {
    const cached = List.from(await discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME)));
    const search = {
        path: {$match: `${EXTENSION_NPM_PREFIX}*`},
        repo: {$eq: EXTENSION_REPO_NAME},
    };

    const {results} = await got(EXTENSION_SEARCH_PATH, {
        // @todo: handle env vars
        body: `items.find(${JSON.stringify(search)})`,
        method: 'POST',
        password: JFROG_PRIVATE_REGISTRY_PASSWORD,
        username: JFROG_PRIVATE_REGISTRY_USERNAME,
    }).json();

    return cached.concat(mapArtifactoryResponse(List.from(results)));
}

function mapArtifactoryResponse(results: List<any>): List<IExtensionVersion> {
    return results
        .mapEach(({name}) => {
            const nameVal = Str.from(name);

            return nameVal
                .replace('.tgz', '')
                .split('-')
                .last.map((versionPart) => {
                    if (None.isNone(versionPart) || versionPart.isEmpty) {
                        return None.EMPTY;
                    }

                    const found = semver.coerce(`${versionPart}`);

                    return found ? Str.from(found.version) : None.EMPTY;
                })
                .flatMap((version) => {
                    // @todo: discuss if mapping maybes should not exec if empty?
                    if (None.isNone(version)) {
                        return version;
                    }

                    return nameVal.split(`-${version}`).first.flatMap((extName) => {
                        if (None.isNone(extName)) {
                            return extName;
                        }

                        return {
                            name: `${extName}`,
                            origin: EXTENSION_ORIGIN.ONLINE,
                            version: `${version}`,
                        };
                    });
                });
        })
        .compact();
}
