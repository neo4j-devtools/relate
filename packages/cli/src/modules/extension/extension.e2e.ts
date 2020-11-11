import {test} from '@oclif/test';
import path from 'path';
import {envPaths, EXTENSION_DIR_NAME, NotFoundError, TestExtensions, IInstalledExtension} from '@relate/common';

import InstallCommand from '../../commands/extension/install';
import UninstallCommand from '../../commands/extension/uninstall';

const TEST_ENVIRONMENT_NAME = 'test';

describe('$relate extension', () => {
    let extensions: TestExtensions;
    let testExtension: IInstalledExtension;
    let testArchive: IInstalledExtension;

    beforeAll(async () => {
        extensions = await TestExtensions.init(__filename);
        testExtension = await extensions.cacheNew();
        testArchive = await extensions.cacheArchive();
    });

    afterAll(async () => {
        await extensions.teardown();
    });

    test.stdout().it('installs extension from cache', async (ctx) => {
        await InstallCommand.run([
            testExtension.name,
            '--version',
            testExtension.version,
            '--environment',
            TEST_ENVIRONMENT_NAME,
        ]);

        expect(ctx.stdout).toContain(testExtension.name);
    });

    test.stderr().it('throws when extension not in cache', async () => {
        try {
            await InstallCommand.run(['missing-extension', '-V', '1.0.0', '--environment', TEST_ENVIRONMENT_NAME]);
        } catch (e) {
            expect(e).toEqual(new NotFoundError(`Unable to find the requested extension: missing-extension online`));
        }
    });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([testExtension.name, '--environment', TEST_ENVIRONMENT_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${testExtension.name}@`);
    });

    test.stdout().it('installs extension from file', async (ctx) => {
        const extensionPath = path.join(envPaths().cache, EXTENSION_DIR_NAME, `${testArchive.name}.tgz`);
        await InstallCommand.run([
            testArchive.name,
            '--version',
            extensionPath,
            '--environment',
            TEST_ENVIRONMENT_NAME,
        ]);

        expect(ctx.stdout).toContain(testArchive.name);
    });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([testArchive.name, '--environment', TEST_ENVIRONMENT_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${testArchive.name}@`);
    });
});
