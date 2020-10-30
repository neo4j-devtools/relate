import got from 'got';
import semver from 'semver';
import {promises as fs} from 'fs';
import _ from 'lodash';
import fse from 'fs-extra';
import path from 'path';
import {List, Str, Dict} from '@relate/types';

import {
    EXTENSION_DIR_NAME,
    EXTENSION_ORIGIN,
    EXTENSION_MANIFEST_FILE,
    EXTENSION_MANIFEST_KEY,
    EXTENSION_TYPES,
    PACKAGE_JSON,
    RELATE_NPM_PREFIX,
    EXTENSION_VERIFICATION_STATUS,
} from '../../constants';
import {EXTENSION_KEYWORD_NAME, EXTENSION_SEARCH_PATH} from '../../entities/environments';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {ExtensionInfoModel} from '../../models';
import {envPaths} from '../env-paths';
import {verifyApp} from '@neo4j/code-signer';
import {RELATE_ROOT_CERT} from '../../entities/extensions/extensions.constants';

export const discoverExtensionDistributions = async (distributionsRoot: string): Promise<List<ExtensionInfoModel>> => {
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

export async function discoverExtension(extensionRootDir: string): Promise<ExtensionInfoModel> {
    const exists = await fse.pathExists(extensionRootDir);
    const dirName = path.basename(extensionRootDir);

    if (!exists) {
        throw new NotFoundError(`Extension ${dirName} not found`);
    }

    const extensionManifest = path.join(extensionRootDir, EXTENSION_MANIFEST_FILE);
    const hasManifestFile = await fse.pathExists(extensionManifest);
    const extensionPackageJson = path.join(extensionRootDir, PACKAGE_JSON);
    const hasPackageJson = await fse.pathExists(extensionPackageJson);

    if (!hasPackageJson) {
        throw new InvalidArgumentError(`${dirName} contains no package.json`);
    }

    const packageJson = await fse.readJSON(extensionPackageJson);
    const appResult = await verifyApp({
        appPath: extensionRootDir,
        rootCertificatePem: RELATE_ROOT_CERT,
        checkRevocationStatus: true,
    });
    const verificationStatus = Str.from(EXTENSION_VERIFICATION_STATUS.UNKNOWN)
        .map(() => {
            if (appResult.revocationStatus !== 'OK') {
                return EXTENSION_VERIFICATION_STATUS[appResult.revocationStatus];
            }

            return EXTENSION_VERIFICATION_STATUS[appResult.status];
        })
        .get();

    const {name, main = '.', version} = packageJson;
    const defaultManifest = Dict.from({
        main,
        name,
        version,
        root: extensionRootDir,
    });

    const manifest = await defaultManifest.switchMap(async (m) => {
        if (hasManifestFile) {
            return defaultManifest.merge(await fse.readJSON(extensionManifest));
        }

        if (_.has(packageJson, EXTENSION_MANIFEST_KEY)) {
            return defaultManifest.merge(packageJson[EXTENSION_MANIFEST_KEY]);
        }

        return m;
    });

    return new ExtensionInfoModel(
        manifest
            .switchMap((m) =>
                m.merge({
                    dist: extensionRootDir,
                    official: m
                        .getValue('name')
                        .getOrElse('')
                        .startsWith(RELATE_NPM_PREFIX),
                    type: m.getValue('type').getOrElse(EXTENSION_TYPES.STATIC),
                    verification: verificationStatus,
                    // @todo: how?
                    origin: EXTENSION_ORIGIN.CACHED,
                }),
            )
            .toObject(),
    );
}

export interface IExtensionVersion {
    name: string;
    version: string;
    origin: EXTENSION_ORIGIN;
}

export async function fetchExtensionVersions(): Promise<List<IExtensionVersion>> {
    const cached = await discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME));

    try {
        const {objects} = await got(`${EXTENSION_SEARCH_PATH}?text=keywords:${EXTENSION_KEYWORD_NAME}`).json();

        return mapNPMResponse(cached.concat(List.from<any>(objects).mapEach((obj) => obj.package)));
    } catch (e) {
        return List.from();
    }
}

function mapNPMResponse(results: List<any>): List<IExtensionVersion> {
    return results
        .mapEach(({name, origin, version}) => {
            return {
                name,
                origin: origin || EXTENSION_ORIGIN.ONLINE,
                version: `${version}`,
            };
        })
        .compact();
}
