import {test} from '@oclif/test';
import path from 'path';
import {envPaths, EXTENSION_DIR_NAME, NotFoundError, TestExtensions, IInstalledExtension} from '@relate/common';

import InstallCommand from '../../commands/extension/install';
import UninstallCommand from '../../commands/extension/uninstall';

const TEST_EXTENSION_NAME = 'neo4j-insight';
const TEST_ENVIRONMENT_NAME = 'test';

describe('$relate extension', () => {
    const extensions = new TestExtensions(__filename);
    let testExtension: IInstalledExtension;

    beforeAll(async () => {
        testExtension = await extensions.cacheNew();
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

    test.skip()
        .stderr()
        .it('throws when extension not in cache', async () => {
            try {
                await InstallCommand.run(['missing-extension', '-V', '1.0.0', '--environment', TEST_ENVIRONMENT_NAME]);
            } catch (e) {
                expect(e).toEqual(new NotFoundError('fetch and install missing-extension@1.0.0'));
            }
        });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([testExtension.name, '--environment', TEST_ENVIRONMENT_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${testExtension.name}@`);
    });

    test.stdout().it('installs extension from file', async (ctx) => {
        const extensionPath = path.join(envPaths().cache, EXTENSION_DIR_NAME, `${TEST_EXTENSION_NAME}.zip`);
        await InstallCommand.run([
            TEST_EXTENSION_NAME,
            '--version',
            extensionPath,
            '--environment',
            TEST_ENVIRONMENT_NAME,
        ]);

        expect(ctx.stdout).toContain(TEST_EXTENSION_NAME);
    });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([TEST_EXTENSION_NAME, '--environment', TEST_ENVIRONMENT_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${TEST_EXTENSION_NAME}@`);
    });
});
