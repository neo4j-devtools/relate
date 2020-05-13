/* eslint-disable */ 
import fse from 'fs-extra';
import got from 'got';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import stream from 'stream';
import {promisify} from 'util';
import {coerce} from 'semver';
import hasha from 'hasha';

import {FetchError, NotFoundError, IntegrityError} from '../errors';
import {envPaths} from './env-paths';
import {extractExtension} from './extract-extension';

const NEO4J_SHA_ALGORITHM = 'sha1';
const EXTENSION_URL_PATH = 'https://neo.jfrog.io/artifactory/api/npm/npm-local-private/@relate-ext/';

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

export const fetchExtensionInfo = async (
    extensionName: string,
    version: string,
): Promise<{name: string; tarball: string; shasum: string}> => {
    let res: IExtensionRegistryManifest;
    try {
        res = await got(`${EXTENSION_URL_PATH}${extensionName}`, {
            username: '',
            password: '',
        }).json();
    } catch (error) {
        throw new FetchError(`Invalid response from "${EXTENSION_URL_PATH}${extensionName}"`);
    }

    const requestedVersion = version === '*' ? res['dist-tags'].latest : coerce(version) && coerce(version)!.version;
    if (!requestedVersion || !res.versions[requestedVersion]) {
        throw new NotFoundError(`Unable to find the requested version: ${version} online`);
    }

    const {
        name,
        dist: {tarball, shasum},
    } = res.versions[requestedVersion];
    return {
        name: name.split('/').length > 1 ? name.split('/')[1] : name,
        // extensionVersion,
        tarball,
        shasum,
    };
};

export const pipeline = async (url: string, outputPath: string): Promise<void> => {
    const streamPipeline = promisify(stream.pipeline);

    try {
        await streamPipeline(
            got.stream(url, {
                username: 'devtools-reader',
                password: 'zaFwod-rypvyh-3mohka',
            }),
            fse.createWriteStream(outputPath),
        );
    } catch (e) {
        // remove tmp output
        await fse.remove(outputPath);
        throw new FetchError(e);
    }
};

export const verifyHash = async (
    expectedShasumHash: string,
    pathToFile: string,
    algorithm = NEO4J_SHA_ALGORITHM,
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
): Promise<void> => {
    const {tarball, shasum} = await fetchExtensionInfo(name, version);

    const tmpName = uuidv4();
    const tmpPath = path.join(envPaths().tmp, tmpName);

    await pipeline(tarball, tmpPath);
    await verifyHash(shasum, tmpPath);

    // extract extension to cache dir first
    await extractExtension(tmpPath, extensionDistributionsPath);

    // @todo: get the archive name from parsing the tarball url. Not sure if this can be constructed instead similar to downloadNeo4j but unsure how consitent the naming format is across extensions.
    const {name: archiveName, ext} = path.parse(tarball);
    const extensionArchiveName = `${archiveName}${ext}`;
    const archivePath = path.join(extensionDistributionsPath, extensionArchiveName);
    // rename the tmp output
    await fse.rename(tmpPath, archivePath);
    // remove tmp output
    return fse.remove(tmpPath);
};
