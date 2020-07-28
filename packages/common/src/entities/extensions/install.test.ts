import path from 'path';

import {TestExtensions} from '../../utils/system/test-extensions';
import {TestDbmss} from '../../utils/system/test-dbmss';
import {InvalidArgumentError} from '../../errors/invalid-argument.error';
import {NotSupportedError} from '../../errors/not-supported.error';
import * as extensionVersions from '../../utils/extensions/extension-versions';
import * as downloadExtensionUtils from '../../utils/extensions/download-extension';
import {EXTENSION_TYPES, EXTENSION_ORIGIN, EXTENSION_DIR_NAME} from '../../constants';
import {NotFoundError} from '../../errors/not-found.error';
import {envPaths} from '../../utils/env-paths';
import {IInstalledExtension} from '../../models/extension.model';
import {List} from '@relate/types';

describe('Extensions - install', () => {
    let testExtensions: TestExtensions;
    let testDbmss: TestDbmss;

    beforeAll(async () => {
        testExtensions = new TestExtensions(__filename);
        testDbmss = await TestDbmss.init(__filename);
    });

    afterAll(async () => {
        await testExtensions.teardown();
        await testDbmss.teardown();
    });

    afterEach(() => jest.restoreAllMocks());

    describe('errors thrown', () => {
        test('with no version', async () => {
            await expect(testDbmss.environment.extensions.install(testExtensions.createName(), '')).rejects.toThrow(
                new InvalidArgumentError('Version must be specified'),
            );
        });

        test('with invalid version', async () => {
            await expect(
                testDbmss.environment.extensions.install(testDbmss.createName(), 'notAVersionOrUrlOrFilePath'),
            ).rejects.toThrow(new InvalidArgumentError('Provided version argument is not valid semver, url or path.'));
        });

        // @todo: this will need to install eventually?
        test('with valid version (URL)', async () => {
            const testExtensionName = testDbmss.createName();
            await expect(
                testDbmss.environment.extensions.install(testExtensionName, 'https://valid.url.com'),
            ).rejects.toThrow(
                new NotSupportedError(`fetch and install extension ${testExtensionName}@https://valid.url.com`),
            );
        });

        test('with no existing version (file path)', async () => {
            const message = 'Provided version argument is not valid semver, url or path.';

            await expect(
                testDbmss.environment.extensions.install(testDbmss.createName(), path.join('non', 'existing', 'path')),
            ).rejects.toThrow(new InvalidArgumentError(message));
        });

        test('with invalid, non cached version (semver)', async () => {
            const invalidTestVersion = '0.0.0';
            const TEST_EXTENSION_NAME = 'testExtension';
            const spy = jest.spyOn(downloadExtensionUtils, 'downloadExtension').mockImplementation(() => {
                throw new Error();
            });

            await expect(
                testDbmss.environment.extensions.install(TEST_EXTENSION_NAME, invalidTestVersion),
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
        let testExtensionManifest: IInstalledExtension;
        let testExtensionMeta: extensionVersions.IExtensionMeta;
        let installedExtensionMeta: extensionVersions.IExtensionMeta;

        beforeAll(async () => {
            testExtensionManifest = await testExtensions.cacheArchive(EXTENSION_TYPES.STATIC);
            testExtensionMeta = {
                dist: path.join(
                    envPaths().cache,
                    EXTENSION_DIR_NAME,
                    `${testExtensionManifest.name}@${testExtensionManifest.version}`,
                ),
                manifest: testExtensionManifest,
                name: testExtensionManifest.name,
                origin: EXTENSION_ORIGIN.CACHED,
                type: EXTENSION_TYPES.STATIC,
                version: testExtensionManifest.version,
            };
        });

        test('with valid version (file path)', async () => {
            installedExtensionMeta = await testDbmss.environment.extensions.install(
                testExtensionMeta.name,
                path.join(envPaths().cache, EXTENSION_DIR_NAME, `${testExtensionManifest.name}.tgz`),
            );
            expect(installedExtensionMeta).toEqual(testExtensionMeta);

            const extractedArchiveList: extensionVersions.IExtensionMeta[] = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();
            expect(extractedArchiveList).toHaveLength(1);
            expect(extractedArchiveList[0]).toEqual(testExtensionMeta);
        });

        test('with valid version (file path) will not reinstall existing extension', async () => {
            await expect(
                testDbmss.environment.extensions.install(
                    testExtensionMeta.name,
                    path.join(envPaths().cache, EXTENSION_DIR_NAME, `${testExtensionManifest.name}.tgz`),
                ),
            ).rejects.toThrow(new InvalidArgumentError(`${testExtensionManifest.name} is already installed`));

            const extractedArchiveList: extensionVersions.IExtensionMeta[] = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();
            expect(extractedArchiveList).toHaveLength(1);
            expect(extractedArchiveList[0].name).toEqual(installedExtensionMeta.name);
        });

        test('with valid cached version (semver)', async () => {
            // uninstall existing extension from data
            await testDbmss.environment.extensions.uninstall(installedExtensionMeta.name);

            const extractedArchiveList: extensionVersions.IExtensionMeta[] = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();
            expect(extractedArchiveList).toHaveLength(1);

            installedExtensionMeta = await testDbmss.environment.extensions.install(
                testExtensionMeta.name,
                testExtensionMeta.version,
            );
            expect(installedExtensionMeta).toEqual(testExtensionMeta);
        });

        test('with valid non-cached version (semver)', async () => {
            // uninstall existing extension from data
            await testDbmss.environment.extensions.uninstall(installedExtensionMeta.name);

            const extractedArchiveList: extensionVersions.IExtensionMeta[] = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();
            expect(extractedArchiveList).toHaveLength(1);

            // mock no existing cached dists
            jest.spyOn(extensionVersions, 'discoverExtensionDistributions').mockResolvedValue(List.from());
            const spy = jest.spyOn(downloadExtensionUtils, 'downloadExtension').mockResolvedValue(testExtensionMeta);

            installedExtensionMeta = await testDbmss.environment.extensions.install(testExtensionMeta.name, '1.0.0');
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(
                testExtensionMeta.name,
                '1.0.0',
                path.join(envPaths().cache, EXTENSION_DIR_NAME),
            );
            expect(installedExtensionMeta).toEqual(testExtensionMeta);
        });

        test('uninstalling extension works as expected', async () => {
            expect((await testDbmss.environment.extensions.list()).toArray()).toHaveLength(1);

            await testDbmss.environment.extensions.uninstall(installedExtensionMeta.name);

            // expect data dir to be empty but dists to still exist
            expect((await testDbmss.environment.extensions.list()).toArray()).toHaveLength(0);
            const extractedArchiveList: extensionVersions.IExtensionMeta[] = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();
            expect(extractedArchiveList).toHaveLength(1);
        });
    });
});
