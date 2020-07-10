import path from 'path';

import {getAppBasePath} from './get-app-base-path';
import * as installExtensions from './get-installed-extensions';
import * as extensionVersions from './extension-versions';
import {NotFoundError} from '../../errors';
import {EXTENSION_TYPES, EXTENSION_ORIGIN} from '../../constants';
import {IInstalledExtension} from '../../models';

const TEST_APP_NAME = 'testApp';
const TEST_INSTALLED_EXTENSION: IInstalledExtension = {
    name: TEST_APP_NAME,
    version: '',
    type: EXTENSION_TYPES.STATIC,
    main: path.join('path', 'to', 'main'),
    root: path.join('path', 'to', 'root'),
};
const TEST_EXTENSION_META: extensionVersions.IExtensionMeta = {
    name: TEST_APP_NAME,
    manifest: TEST_INSTALLED_EXTENSION,
    type: EXTENSION_TYPES.STATIC,
    version: '',
    dist: '',
    origin: EXTENSION_ORIGIN.CACHED,
};

describe('extract', () => {
    afterEach(() => jest.restoreAllMocks());

    test('no installed apps', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => []);
        await expect(getAppBasePath(TEST_APP_NAME)).rejects.toThrow(
            new NotFoundError(`App ${TEST_APP_NAME} not found`),
        );
    });

    test('app is not part of installed apps', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => [
            {
                ...TEST_INSTALLED_EXTENSION,
                name: `${TEST_APP_NAME}2`,
            },
        ]);
        await expect(getAppBasePath(TEST_APP_NAME)).rejects.toThrow(
            new NotFoundError(`App ${TEST_APP_NAME} not found`),
        );
    });

    test('installed app is not a static app', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => [
            {
                ...TEST_INSTALLED_EXTENSION,
                type: EXTENSION_TYPES.SYSTEM,
            },
        ]);
        await expect(getAppBasePath(TEST_APP_NAME)).rejects.toThrow(
            new NotFoundError(`App ${TEST_APP_NAME} not found`),
        );
    });

    test('installed app manifest.main begins with "."', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => [TEST_INSTALLED_EXTENSION]);
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue({
            ...TEST_EXTENSION_META,
            manifest: {
                ...TEST_INSTALLED_EXTENSION,
                main: path.join('.', TEST_INSTALLED_EXTENSION.main),
            },
        });
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });

    test('installed app manifest.main begins with "/"', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => [TEST_INSTALLED_EXTENSION]);
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue({
            ...TEST_EXTENSION_META,
            manifest: {
                ...TEST_INSTALLED_EXTENSION,
                main: path.join('/', TEST_INSTALLED_EXTENSION.main),
            },
        });
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });

    test('installed app manifest.main begins with "./"', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => [TEST_INSTALLED_EXTENSION]);
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue({
            ...TEST_EXTENSION_META,
            manifest: {
                ...TEST_INSTALLED_EXTENSION,
                main: path.join('.', TEST_INSTALLED_EXTENSION.main),
            },
        });
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });

    test('app base path returned scuessfully', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensions').mockImplementation(() => [TEST_INSTALLED_EXTENSION]);
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue(TEST_EXTENSION_META);
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(
            path.join('/', TEST_APP_NAME, TEST_INSTALLED_EXTENSION.main),
        );
    });
});
