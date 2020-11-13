import path from 'path';

import * as extensionVersions from './extension-versions';
import {TestExtensions} from '../system/test-extensions';
import {IInstalledExtension} from '../../models/extension.model';

import {EXTENSION_DIR_NAME, EXTENSION_ORIGIN, EXTENSION_TYPES, EXTENSION_VERIFICATION_STATUS} from '../../constants';
import {NotFoundError} from '../../errors';

const TEST_EXTENSION = 'test-extension';
const TEST_EXTENSION_VERSION = '1.0.0';
const TEST_REPO = 'test-repo';

jest.mock('got', () => ({
    __esModule: true,
    default: jest
        .fn()
        .mockImplementationOnce(() => {
            return {
                json: jest.fn().mockResolvedValue({}),
            };
        })
        .mockImplementation(() => {
            return {
                json: jest.fn().mockResolvedValue({
                    objects: [
                        {
                            package: {
                                repo: TEST_REPO,
                                name: TEST_EXTENSION,
                                version: TEST_EXTENSION_VERSION,
                            },
                        },
                    ],
                }),
            };
        }),
}));

describe('extension versions', () => {
    let extensions: TestExtensions;

    beforeAll(async () => {
        extensions = await TestExtensions.init(__filename);
    });

    afterAll(() => extensions.teardown());

    describe('no extensions installed', () => {
        test('extension distributions empty (if none existing)', async () => {
            const extensionMeta = (
                await extensionVersions.discoverExtensionDistributions(
                    path.join(extensions.environment.cachePath, EXTENSION_DIR_NAME),
                )
            ).toArray();

            expect(extensionMeta.some((ext) => ext.name.includes(path.basename(__filename)))).toBeFalsy();
        });

        test('extension distributions throws (if none existing)', async () => {
            const NON_EXISTING_APP = 'non-existing-app';

            await expect(
                extensionVersions.discoverExtension(
                    path.join(
                        extensions.environment.dataPath,
                        EXTENSION_DIR_NAME,
                        EXTENSION_TYPES.STATIC,
                        NON_EXISTING_APP,
                    ),
                ),
            ).rejects.toThrow(new NotFoundError(`Extension ${NON_EXISTING_APP} not found`));
        });

        test('extension version list (online error and no cached versions)', async () => {
            const extensionVersionList = (await extensionVersions.fetchExtensionVersions()).toArray();

            expect(extensionVersionList.some((ext) => ext.name.includes(path.basename(__filename)))).toBeFalsy();
        });

        test('extension version list (online and no cached versions)', async () => {
            const extensionVersionList = (await extensionVersions.fetchExtensionVersions()).toArray();

            expect(extensionVersionList.filter((ext) => ext.name.includes(TEST_EXTENSION))).toEqual([
                {
                    name: TEST_EXTENSION,
                    origin: EXTENSION_ORIGIN.ONLINE,
                    version: TEST_EXTENSION_VERSION,
                },
            ]);
        });
    });

    describe('extensions installed', () => {
        let testCachedExtension: IInstalledExtension;
        let testInstalledExtension: IInstalledExtension;

        beforeAll(async () => {
            testCachedExtension = await extensions.cacheNew(EXTENSION_TYPES.STATIC);
            testInstalledExtension = await extensions.installNew(EXTENSION_TYPES.STATIC);
        });

        test('extensions discovered (if existing and with a package.json)', async () => {
            const extensionMeta = await extensionVersions.discoverExtension(
                path.join(
                    extensions.environment.dataPath,
                    EXTENSION_DIR_NAME,
                    EXTENSION_TYPES.STATIC,
                    testInstalledExtension.name,
                ),
            );

            expect(extensionMeta).toEqual({
                name: testInstalledExtension.name,
                dist: path.join(
                    extensions.environment.dataPath,
                    EXTENSION_DIR_NAME,
                    EXTENSION_TYPES.STATIC,
                    testInstalledExtension.name,
                ),
                main: testInstalledExtension.main,
                root: testInstalledExtension.root,
                official: false,
                verification: EXTENSION_VERIFICATION_STATUS.UNSIGNED,
                origin: EXTENSION_ORIGIN.CACHED,
                type: testInstalledExtension.type,
                version: testInstalledExtension.version,
            });
        });

        test('extension distributions discovered (if existing)', async () => {
            const extensionMeta = (
                await extensionVersions.discoverExtensionDistributions(
                    path.join(extensions.environment.cachePath, EXTENSION_DIR_NAME),
                )
            )
                .toArray()
                .filter((ext) => ext.name.includes(testCachedExtension.name));

            expect(extensionMeta).toHaveLength(1);

            expect(extensionMeta[0]).toEqual({
                name: testCachedExtension.name,
                dist: path.join(
                    path.join(extensions.environment.cachePath, EXTENSION_DIR_NAME),
                    testCachedExtension.name,
                ),
                main: testCachedExtension.main,
                root: testCachedExtension.root,
                official: false,
                verification: EXTENSION_VERIFICATION_STATUS.UNSIGNED,
                origin: EXTENSION_ORIGIN.CACHED,
                type: testCachedExtension.type,
                version: testCachedExtension.version,
            });
        });

        test('extension version list (online and cached versions)', async () => {
            const extensionVersionList = (await extensionVersions.fetchExtensionVersions())
                .toArray()
                .filter((ext) => ext.name.includes(testCachedExtension.name) || ext.name === TEST_EXTENSION);

            expect(extensionVersionList).toEqual([
                {
                    name: testCachedExtension.name,
                    origin: EXTENSION_ORIGIN.CACHED,
                    version: testCachedExtension.version,
                },
                {
                    name: TEST_EXTENSION,
                    origin: EXTENSION_ORIGIN.ONLINE,
                    version: TEST_EXTENSION_VERSION,
                },
            ]);
        });
    });
});
