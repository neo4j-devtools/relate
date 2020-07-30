import fse from 'fs-extra';
import path from 'path';
import semver from 'semver';

import {NotSupportedError} from '../../errors';
import {download, envPaths, extract, emitHookEvent} from '..';
import {
    RUNTIME_DIR_NAME,
    ZULU_JAVA_DOWNLOAD_URL,
    ZULU_JAVA_VERSION,
    NEO4J_JAVA_11_VERSION_RANGE,
} from '../../entities/environments/environment.constants';
import {HOOK_EVENTS} from '../../constants';

interface IJavaName {
    dirname: string;
    extension: string;
    archive: string;
}

const resolveJavaName = (dbmsVersion: string): IJavaName => {
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

    const javaVersion = semver.satisfies(dbmsVersion, NEO4J_JAVA_11_VERSION_RANGE)
        ? ZULU_JAVA_VERSION.JAVA_11
        : ZULU_JAVA_VERSION.JAVA_8;

    if (process.arch !== 'x64') {
        throw new NotSupportedError('Unsupported architecture, install Java manually');
    }

    const dirname = `zulu${javaVersion}-${platform}_${process.arch}`;

    return {
        archive: `${dirname}.${ext}`,
        dirname,
        extension: `.${ext}`,
    };
};

export const downloadJava = async (dbmsVersion: string): Promise<void> => {
    const javaArchiveName = resolveJavaName(dbmsVersion).archive;

    const runtimeDir = path.join(envPaths().cache, RUNTIME_DIR_NAME);
    const downloadUrl = new URL(javaArchiveName, ZULU_JAVA_DOWNLOAD_URL).toString();

    const localArchivePath = path.join(runtimeDir, javaArchiveName);
    await emitHookEvent(HOOK_EVENTS.JAVA_DOWNLOAD_START, `downloading ${javaArchiveName}`);
    const downloadFilePath = await download(downloadUrl, runtimeDir);
    await emitHookEvent(HOOK_EVENTS.JAVA_DOWNLOAD_STOP, null);
    await fse.move(downloadFilePath, localArchivePath);

    await emitHookEvent(HOOK_EVENTS.JAVA_EXTRACT_START, `extracting ${javaArchiveName}`);
    await extract(localArchivePath, runtimeDir);
    await emitHookEvent(HOOK_EVENTS.JAVA_EXTRACT_STOP, null);
    await fse.remove(localArchivePath);
};

export const resolveRelateJavaHome = async (dbmsVersion: string): Promise<string | null> => {
    const javaDirPath = path.join(envPaths().cache, RUNTIME_DIR_NAME, resolveJavaName(dbmsVersion).dirname);
    const existsLocally = await fse.pathExists(path.join(javaDirPath, 'bin', 'java'));

    if (existsLocally) {
        return javaDirPath;
    }

    return null;
};
