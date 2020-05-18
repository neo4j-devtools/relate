import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import stream from 'stream';
import {promisify} from 'util';
import {v4 as uuidv4} from 'uuid';

import {DOWNLOADING_FILE_EXTENSION} from '../constants';
import {FetchError} from '../errors';

// @todo: this still needs a test in future as I couldn't figure out the tests just yet.
// https://dev.to/cdanielsen/testing-streams-a-primer-3n6e has some interesting points to start with.
export const download = async (url: string, outputFilePath: string): Promise<void> => {
    // Download straight to the destination directory with a temporary name that
    // makes it obvious that the file is not finished downloading.
    const outputDirPath = path.dirname(outputFilePath);
    const downloadingName = `Unconfirmed_${uuidv4().slice(0, 8)}${DOWNLOADING_FILE_EXTENSION}`;
    const downloadingPath = path.join(outputDirPath, downloadingName);

    await fse.ensureFile(downloadingPath);
    const streamPipeline = promisify(stream.pipeline);

    try {
        await streamPipeline(got.stream(url), fse.createWriteStream(downloadingPath));
        await fse.move(downloadingPath, outputFilePath);
    } catch (e) {
        // remove tmp output
        await fse.remove(downloadingPath);
        throw new FetchError(e);
    }
};
