import fse from 'fs-extra';
import got, {Options} from 'got';
import path from 'path';
import stream from 'stream';
import {promisify} from 'util';
import {v4 as uuidv4} from 'uuid';
import hasha, {AlgorithmName} from 'hasha';

import {DOWNLOADING_FILE_EXTENSION, HOOK_EVENTS} from '../constants';
import {FetchError, IntegrityError} from '../errors';
import {emitHookEvent} from './event-hooks';

export const verifyHash = async (
    expectedShasumHash: string,
    pathToFile: string,
    algorithm: AlgorithmName,
): Promise<void> => {
    const hash = await hasha.fromFile(pathToFile, {algorithm});

    if (hash !== expectedShasumHash) {
        // remove tmp output in this case as it is neither user provided nor trusted
        await fse.remove(pathToFile);
        throw new IntegrityError('Expected hash mismatch');
    }
};

// @todo: this still needs a test in future as I couldn't figure out the tests just yet.
// https://dev.to/cdanielsen/testing-streams-a-primer-3n6e has some interesting points to start with.
export const download = async (url: string, outputDirPath: string, options?: Options): Promise<string> => {
    // Download straight to the destination directory with a temporary name that
    // makes it obvious that the file is not finished downloading.
    const downloadFileName = `Unconfirmed_${uuidv4().slice(0, 8)}${DOWNLOADING_FILE_EXTENSION}`;
    const downloadFilePath = path.join(outputDirPath, downloadFileName);

    const payload = await emitHookEvent(HOOK_EVENTS.WILL_DOWNLOAD, {
        url,
        downloadFilePath,
        skip: false,
    });

    if (payload.skip) {
        return payload.downloadFilePath;
    }

    await fse.ensureFile(downloadFilePath);
    const streamPipeline = promisify(stream.pipeline);

    try {
        await streamPipeline(
            got
                .stream(url, options)
                .on('downloadProgress', (progress) => emitHookEvent(HOOK_EVENTS.DOWNLOAD_PROGRESS, progress)),
            fse.createWriteStream(downloadFilePath),
        );

        return downloadFilePath;
    } catch (e) {
        // remove tmp output
        await fse.remove(downloadFilePath);
        throw new FetchError(e);
    }
};

export const requestJson = async (url: string): Promise<any> => {
    const payload = await emitHookEvent(HOOK_EVENTS.WILL_REQUEST_JSON, {
        url,
        response: null,
        skip: false,
    });

    if (payload.skip) {
        return payload.response;
    }

    return got(url).json();
};

export const request = async (url: string): Promise<any> => {
    const payload = await emitHookEvent(HOOK_EVENTS.WILL_REQUEST, {
        url,
        response: null,
        skip: false,
    });

    if (payload.skip) {
        return payload.response;
    }

    return got(url);
};
