import fse from 'fs-extra';
import got from 'got';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import stream from 'stream';
import {promisify} from 'util';
import hasha from 'hasha';

import {FetchError, NotFoundError, IntegrityError} from '../../../errors';
import {extractExtension} from './extract-extension';
import {EXTENSION_URL_PATH, EXTENSION_SHA_ALGORITHM, DOWNLOADING_FILE_EXTENSION} from '../../../constants';
import {discoverExtension, IExtensionMeta} from './extension-versions';
import {JFROG_PRIVATE_REGISTRY_PASSWORD, JFROG_PRIVATE_REGISTRY_USERNAME} from '../../environment.constants';

export interface IExtensionRegistryManifest {
    name: string;
    'dist-tags': {
        [latest: string]: string;
    };
    versions: {
        [version: string]: {
            name: string;
            version: string;
            dist: {
                tarball: string;
                shasum: string;
            };
        };
    };
}

export interface IFetchExtensionInfo {
    tarball: string;
    shasum: string;
}

const fetchExtensionInfo = async (extensionName: string, version: string): Promise<IFetchExtensionInfo> => {
    let res: IExtensionRegistryManifest;
    try {
        res = await got(`${EXTENSION_URL_PATH}${extensionName}`, {
            // @todo: handle env vars
            password: JFROG_PRIVATE_REGISTRY_PASSWORD,
            username: JFROG_PRIVATE_REGISTRY_USERNAME,
        }).json();
    } catch (error) {
        throw new FetchError(`Invalid response from "${EXTENSION_URL_PATH}${extensionName}"`);
    }

    if (!res.versions[version]) {
        throw new NotFoundError(`Unable to find the requested version: ${version} online`);
    }

    const {
        dist: {tarball, shasum},
    } = res.versions[version];

    return {
        shasum,
        tarball,
    };
};

const pipeline = async (url: string, outputPath: string): Promise<void> => {
    const streamPipeline = promisify(stream.pipeline);

    try {
        await streamPipeline(
            got.stream(url, {
                password: JFROG_PRIVATE_REGISTRY_PASSWORD,
                username: JFROG_PRIVATE_REGISTRY_USERNAME,
            }),
            fse.createWriteStream(outputPath),
        );
    } catch (e) {
        // remove tmp output
        await fse.remove(outputPath);
        throw new FetchError(e);
    }
};

const verifyHash = async (
    expectedShasumHash: string,
    pathToFile: string,
    algorithm = EXTENSION_SHA_ALGORITHM,
): Promise<string> => {
    const hash = await hasha.fromFile(pathToFile, {algorithm});
    if (hash !== expectedShasumHash) {
        // remove tmp output
        await fse.remove(pathToFile);
        throw new IntegrityError('Expected hash mismatch');
    }
    return hash;
};

export const downloadExtension = async (
    name: string,
    version: string,
    extensionDistributionsPath: string,
): Promise<IExtensionMeta> => {
    const {tarball, shasum} = await fetchExtensionInfo(name, version);

    // Download straight to the distribution path with a temporary name that
    // makes it obvious that the file is not finished downloading.
    const downloadingName = `${uuidv4()}${DOWNLOADING_FILE_EXTENSION}`;
    const downloadingPath = path.join(extensionDistributionsPath, downloadingName);

    await pipeline(tarball, downloadingPath);
    await verifyHash(shasum, downloadingPath);

    // extract extension to cache dir first
    const extractPath = path.join(extensionDistributionsPath, `${name}@${version}.tmp`);
    const {name: extensionName, dist, version: extensionVersion} = await extractExtension(downloadingPath, extractPath);
    const destinationPath = path.join(extensionDistributionsPath, `${extensionName}@${extensionVersion}`);

    // move the extracted dir and remove the downloaded archive
    await fse.move(dist, destinationPath, {overwrite: true});
    await fse.remove(extractPath);
    await fse.remove(downloadingPath);

    return discoverExtension(destinationPath);
};
