import path from 'path';

import * as extensionVersions from './extension-versions';
import {TestExtensions} from '../system/test-extensions';
import {IInstalledExtension} from '../../models/extension.model';
import {envPaths} from '../env-paths';
import {EXTENSION_DIR_NAME, EXTENSION_ORIGIN, EXTENSION_TYPES} from '../../constants';
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
                    results: [
                        {
                            repo: TEST_REPO,
                            name: `${TEST_EXTENSION}-${TEST_EXTENSION_VERSION}.tgz`,
                        },
                    ],
                }),
            };
        }),
}));

describe('extension versions', () => {
    let extensions: TestExtensions;
    let testExtension: IInstalledExtension;

    beforeAll(() => {
        extensions = new TestExtensions(__filename);
    });

    afterAll(() => extensions.teardown());

    describe('no extensions installed', () => {
        test('extension distributions empty (if none existing)', async () => {
            const extensionMeta = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();

            expect(extensionMeta).toHaveLength(0);
        });

        test('extension distributions throws (if none existing)', async () => {
            const NON_EXISTING_APP = 'non-existing-app';

            await expect(
                extensionVersions.discoverExtension(
                    path.join(envPaths().data, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC, NON_EXISTING_APP),
                ),
            ).rejects.toThrow(new NotFoundError(`Extension ${NON_EXISTING_APP} not found`));
        });

        test('extension version list (online error and no cached versions)', async () => {
            const extensionVersionList = (await extensionVersions.fetchExtensionVersions()).toArray();

            expect(extensionVersionList).toHaveLength(0);
        });

        test('extension version list (online and no cached versions)', async () => {
            const extensionVersionList = (await extensionVersions.fetchExtensionVersions()).toArray();

            expect(extensionVersionList).toEqual([
                {
                    name: TEST_EXTENSION,
                    origin: EXTENSION_ORIGIN.ONLINE,
                    version: TEST_EXTENSION_VERSION,
                },
            ]);
        });
    });

    describe('extensions installed', () => {
        test('extensions discovered (if existing and with a package.json)', async () => {
            testExtension = await extensions.installNew();
            const extensionMeta = await extensionVersions.discoverExtension(
                path.join(envPaths().data, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC, testExtension.name),
            );

            expect(extensionMeta).toEqual({
                name: testExtension.name,
                dist: path.join(envPaths().data, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC, testExtension.name),
                manifest: {
                    name: testExtension.name,
                    type: testExtension.type,
                    version: testExtension.version,
                    main: testExtension.main,
                    root: testExtension.root,
                },
                origin: EXTENSION_ORIGIN.CACHED,
                type: testExtension.type,
                version: testExtension.version,
            });
        });

        test('extension distributions discovered (if existing)', async () => {
            testExtension = await extensions.cacheNew();
            const extensionMeta = (
                await extensionVersions.discoverExtensionDistributions(path.join(envPaths().cache, EXTENSION_DIR_NAME))
            ).toArray();

            expect(extensionMeta[0]).toEqual({
                name: testExtension.name,
                dist: path.join(path.join(envPaths().cache, EXTENSION_DIR_NAME), testExtension.name),
                manifest: {
                    name: testExtension.name,
                    type: testExtension.type,
                    version: testExtension.version,
                    main: testExtension.main,
                    root: testExtension.root,
                },
                origin: EXTENSION_ORIGIN.CACHED,
                type: testExtension.type,
                version: testExtension.version,
            });
        });

        test('extension version list (online and cached versions)', async () => {
            const extensionVersionList = (await extensionVersions.fetchExtensionVersions()).toArray();

            expect(extensionVersionList).toEqual([
                {
                    name: testExtension.name,
                    dist: path.join(path.join(envPaths().cache, EXTENSION_DIR_NAME), testExtension.name),
                    manifest: {
                        name: testExtension.name,
                        type: testExtension.type,
                        version: testExtension.version,
                        main: testExtension.main,
                        root: testExtension.root,
                    },
                    origin: EXTENSION_ORIGIN.CACHED,
                    type: testExtension.type,
                    version: testExtension.version,
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
