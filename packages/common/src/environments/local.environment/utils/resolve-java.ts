import fse from 'fs-extra';
import path from 'path';

import {NotSupportedError} from '../../../errors';
import {download, envPaths, extract} from '../../../utils';
import {RUNTIME_DIR_NAME, ZULU_JAVA_DOWNLOAD_URL, ZULU_JAVA_VERSION} from '../../environment.constants';

interface IJavaName {
    dirname: string;
    extension: string;
    archive: string;
}

const resolveJavaName = (): IJavaName => {
    let platform: string;
    let ext: string;

    switch (process.platform) {
        case 'darwin':
            platform = 'macosx';
            ext = 'tar.gz';
            break;
        case 'win32':
            platform = 'win';
            ext = 'zip';
            break;
        default:
            platform = 'linux';
            ext = 'tar.gz';
    }

    // @todo check if there are other supported architectures or if there are
    // docs for running Neo4j in non x64 hosts that we can point to.
    if (process.arch !== 'x64') {
        throw new NotSupportedError('Unsupported architecture, install Java 11 manually');
    }

    const dirname = `zulu${ZULU_JAVA_VERSION}-${platform}_${process.arch}`;

    return {
        archive: `${dirname}.${ext}`,
        dirname,
        extension: `.${ext}`,
    };
};

export const downloadJava = async (): Promise<void> => {
    const runtimeDir = path.join(envPaths().cache, RUNTIME_DIR_NAME);
    const localArchivePath = path.join(runtimeDir, resolveJavaName().archive);
    const downloadUrl = new URL(resolveJavaName().archive, ZULU_JAVA_DOWNLOAD_URL).toString();

    await download(downloadUrl, localArchivePath);
    await extract(localArchivePath, runtimeDir);
    await fse.remove(localArchivePath);
};

export const resolveRelateJavaHome = async (): Promise<string | null> => {
    const javaDirPath = path.join(envPaths().cache, RUNTIME_DIR_NAME, resolveJavaName().dirname);
    const existsLocally = await fse.pathExists(path.join(javaDirPath, 'bin', 'java'));

    if (existsLocally) {
        return javaDirPath;
    }

    return null;
};
