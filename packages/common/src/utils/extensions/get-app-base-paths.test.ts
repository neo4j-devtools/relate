import {List} from '@relate/types';

import {getAppBasePath} from './get-app-base-path';
import * as installExtensions from './get-installed-extensions';
import * as extensionVersions from './extension-versions';
import {NotFoundError} from '../../errors';
import {EXTENSION_ORIGIN, EXTENSION_TYPES, EXTENSION_VERIFICATION_STATUS} from '../../constants';
import {ExtensionInfoModel, IInstalledExtension} from '../../models';

const TEST_APP_NAME = 'testApp';
const TEST_INSTALLED_EXTENSION: IInstalledExtension = {
    name: TEST_APP_NAME,
    version: '',
    type: EXTENSION_TYPES.STATIC,
    main: 'path/to/main',
    root: 'path/to/root',
};
const TEST_EXTENSION_META = new ExtensionInfoModel({
    ...TEST_INSTALLED_EXTENSION,
    name: TEST_APP_NAME,
    official: true,
    verification: EXTENSION_VERIFICATION_STATUS.TRUSTED,
    type: EXTENSION_TYPES.STATIC,
    version: '',
    dist: '',
    origin: EXTENSION_ORIGIN.CACHED,
});

describe('extract', () => {
    afterEach(() => jest.restoreAllMocks());

    test('no installed apps', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() => List.from([]));
        await expect(getAppBasePath(TEST_APP_NAME)).rejects.toThrow(
            new NotFoundError(`App ${TEST_APP_NAME} not found`),
        );
    });

    test('app is not part of installed apps', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() =>
            List.from([
                {
                    ...TEST_INSTALLED_EXTENSION,
                    name: `${TEST_APP_NAME}2`,
                },
            ]),
        );
        await expect(getAppBasePath(TEST_APP_NAME)).rejects.toThrow(
            new NotFoundError(`App ${TEST_APP_NAME} not found`),
        );
    });

    test('installed app is not a static app', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() =>
            List.from([
                {
                    ...TEST_INSTALLED_EXTENSION,
                    type: EXTENSION_TYPES.SYSTEM,
                },
            ]),
        );
        await expect(getAppBasePath(TEST_APP_NAME)).rejects.toThrow(
            new NotFoundError(`App ${TEST_APP_NAME} not found`),
        );
    });

    test('installed app manifest.main begins with "."', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() =>
            List.from([TEST_INSTALLED_EXTENSION]),
        );
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue(
            new ExtensionInfoModel({
                ...TEST_EXTENSION_META,
                ...TEST_INSTALLED_EXTENSION,
                main: `.${TEST_INSTALLED_EXTENSION.main}`,
            }),
        );
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });

    test(`installed app manifest.main begins with "/"`, async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() =>
            List.from([TEST_INSTALLED_EXTENSION]),
        );
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue(
            new ExtensionInfoModel({
                ...TEST_EXTENSION_META,
                ...TEST_INSTALLED_EXTENSION,
                main: `/${TEST_INSTALLED_EXTENSION.main}`,
            }),
        );
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });

    test(`installed app manifest.main begins with "./"`, async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() =>
            List.from([TEST_INSTALLED_EXTENSION]),
        );
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue(
            new ExtensionInfoModel({
                ...TEST_EXTENSION_META,
                ...TEST_INSTALLED_EXTENSION,
                main: `./${TEST_INSTALLED_EXTENSION.main}`,
            }),
        );
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });

    test('app base path returned successfully', async () => {
        jest.spyOn(installExtensions, 'getInstalledExtensionsSync').mockImplementation(() =>
            List.from([TEST_INSTALLED_EXTENSION]),
        );
        jest.spyOn(extensionVersions, 'discoverExtension').mockResolvedValue(TEST_EXTENSION_META);
        await expect(getAppBasePath(TEST_APP_NAME)).resolves.toBe(`/${TEST_APP_NAME}/${TEST_INSTALLED_EXTENSION.main}`);
    });
});
