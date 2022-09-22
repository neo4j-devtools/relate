import path from 'path';

import {TestExtensions} from '../../utils/system/test-extensions';
import {TestEnvironment} from '../../utils/system/test-environment';
import {InvalidArgumentError} from '../../errors/invalid-argument.error';
import * as extensionVersions from '../../utils/extensions/extension-versions';
import * as downloadExtensionUtils from '../../utils/extensions/download-extension';
import {EXTENSION_TYPES, EXTENSION_DIR_NAME, FILTER_COMPARATORS} from '../../constants';
import {NotFoundError} from '../../errors/not-found.error';
import {envPaths} from '../../utils/env-paths';
import {ExtensionInfoModel, IExtensionInfo, IInstalledExtension} from '../../models/extension.model';
import {List} from '@relate/types';

describe('Extensions - install', () => {
    let testEnv: TestEnvironment;
    let testExtensions: TestExtensions;
    const fileName = path.basename(__filename);

    beforeAll(async () => {
        testEnv = await TestEnvironment.init(__filename);
        testExtensions = new TestExtensions(__filename, testEnv.environment);
    });

    afterAll(async () => {
        await testExtensions.teardown();
        await testEnv.teardown();
    });

    describe('errors thrown', () => {
        afterEach(() => jest.restoreAllMocks());

        test('with no version', async () => {
            await expect(testEnv.environment.extensions.install(testExtensions.createName(), '')).rejects.toThrow(
                new InvalidArgumentError('Version must be specified'),
            );
        });

        test('with invalid version', async () => {
            await expect(
                testEnv.environment.extensions.install(testEnv.createName(), 'notAVersionOrUrlOrFilePath'),
            ).rejects.toThrow(new InvalidArgumentError('Provided version argument is not valid semver, url or path.'));
        });

        test('with no existing version (file path or invalid URL)', async () => {
            const message = 'Provided version argument is not valid semver, url or path.';
            const testExtensionName = testEnv.createName();

            await expect(
                testEnv.environment.extensions.install(testExtensionName, path.join('non', 'existing', 'path')),
            ).rejects.toThrow(new InvalidArgumentError(message));

            await expect(
                testEnv.environment.extensions.install(testExtensionName, 'www/invalidurl.com'),
            ).rejects.toThrow(new InvalidArgumentError(message));
        });

        test('with invalid, non cached version (semver)', async () => {
            const invalidTestVersion = '0.0.0';
            const TEST_EXTENSION_NAME = 'testExtension';
            const spy = jest.spyOn(downloadExtensionUtils, 'downloadExtension').mockImplementation(() => {
                throw new Error();
            });

            await expect(
                testEnv.environment.extensions.install(TEST_EXTENSION_NAME, invalidTestVersion),
            ).rejects.toThrow(new NotFoundError(`Unable to find the requested version: ${invalidTestVersion} online`));
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(
                TEST_EXTENSION_NAME,
                invalidTestVersion,
                path.join(envPaths().cache, EXTENSION_DIR_NAME),
            );
        });
    });

    describe('extension install/uninstall', () => {
        let testCachedExtensionArchive: IInstalledExtension;
        let testCachedExtension: IInstalledExtension;
        const listExtensions = async (type: FILTER_COMPARATORS, value: string): Promise<IExtensionInfo[]> => {
            return (
                await testEnv.environment.extensions.list([
                    {
                        field: 'name',
                        type,
                        value,
                    },
                ])
            ).toArray();
        };
        const discoverDists = async (dirPath: string, value: string): Promise<ExtensionInfoModel[]> => {
            return (await extensionVersions.discoverExtensionDistributions(dirPath))
                .toArray()
                .filter((ext) => ext.name.includes(value));
        };

        beforeAll(async () => {
            testCachedExtensionArchive = await testExtensions.cacheArchive(EXTENSION_TYPES.STATIC);
            testCachedExtension = await testExtensions.cacheNew(EXTENSION_TYPES.STATIC);
        });

        afterEach(() => jest.restoreAllMocks());

        test('with valid version (file path)', async () => {
            expect(await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName)).toHaveLength(0);
            expect(await discoverDists(testEnv.environment.dirPaths.extensionsCache, fileName)).toHaveLength(1);

            // install
            const extensionInfo: IExtensionInfo = await testEnv.environment.extensions.install(
                testCachedExtensionArchive.name,
                path.join(envPaths().cache, EXTENSION_DIR_NAME, `${testCachedExtensionArchive.name}.tgz`),
            );
            expect(extensionInfo.name).toEqual(testCachedExtensionArchive.name);

            expect(
                await discoverDists(testEnv.environment.dirPaths.extensionsCache, testCachedExtensionArchive.name),
            ).toHaveLength(0);
            expect(await discoverDists(testEnv.environment.dirPaths.extensionsData, fileName)).toHaveLength(1);

            // extension is installed
            expect(await listExtensions(FILTER_COMPARATORS.EQUALS, extensionInfo.name)).toHaveLength(1);

            // will not reinstall existing extension
            await expect(
                testEnv.environment.extensions.install(
                    testCachedExtensionArchive.name,
                    path.join(envPaths().cache, EXTENSION_DIR_NAME, `${testCachedExtensionArchive.name}.tgz`),
                ),
            ).rejects.toThrow(new InvalidArgumentError(`${testCachedExtensionArchive.name} is already installed`));
            // installed extensions remain as before
            expect(await listExtensions(FILTER_COMPARATORS.EQUALS, extensionInfo.name)).toHaveLength(1);
        });

        test('uninstalling extension removes extension from data dir', async () => {
            expect(await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName)).toHaveLength(1);

            await testEnv.environment.extensions.uninstall(
                (
                    await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName)
                )[0].name,
            );

            // extension should be deleted
            expect(await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName)).toHaveLength(0);
            // extension should be deleted from data directory
            expect(await discoverDists(testEnv.environment.dirPaths.extensionsData, fileName)).toHaveLength(0);
        });

        test('with valid non-cached version (semver)', async () => {
            expect(await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName)).toHaveLength(0);

            // mock no existing cached distributions
            jest.spyOn(extensionVersions, 'discoverExtensionDistributions').mockResolvedValueOnce(List.from());
            // mock download/extract of archive
            const spy = jest
                .spyOn(downloadExtensionUtils, 'downloadExtension')
                .mockResolvedValue(
                    extensionVersions.discoverExtension(
                        path.join(testEnv.environment.dirPaths.extensionsCache, `${testCachedExtension.name}`),
                    ),
                );

            // install extension
            await testEnv.environment.extensions.install(testCachedExtension.name, testCachedExtension.version);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(
                testCachedExtension.name,
                testCachedExtension.version,
                testEnv.environment.dirPaths.extensionsCache,
            );
            // extracted extension in cache dir should exist in this case
            expect(await discoverDists(testEnv.environment.dirPaths.extensionsCache, fileName)).toHaveLength(1);
            // extension is installed
            expect((await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName))[0].name).toBe(
                testCachedExtension.name,
            );
        });

        test('with valid cached version (semver)', async () => {
            // clear previous installed extension
            const installedExtensionName = (await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName))[0].name;
            await testEnv.environment.extensions.uninstall(installedExtensionName);
            expect(await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName)).toHaveLength(0);

            const spy = jest.spyOn(downloadExtensionUtils, 'downloadExtension');
            // install from current cached extension
            await testEnv.environment.extensions.install(testCachedExtension.name, testCachedExtension.version);

            // should extract from cached extension, not download
            expect(spy).not.toHaveBeenCalled();
            expect(await discoverDists(testEnv.environment.dirPaths.extensionsCache, fileName)).toHaveLength(1);
            expect((await listExtensions(FILTER_COMPARATORS.CONTAINS, fileName))[0].name).toBe(
                testCachedExtension.name,
            );
        });
    });
});
