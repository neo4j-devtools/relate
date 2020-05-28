import {test} from '@oclif/test';
import path from 'path';
import {envPaths, EXTENSION_DIR_NAME, NotFoundError} from '@relate/common';

import InstallCommand from '../../commands/extension/install';
import UninstallCommand from '../../commands/extension/uninstall';

const TEST_EXTENSION_NAME = 'neo4j-insight';
const TEST_EXTENSION_VERSION = '1.0.0';
const TEST_MISSING_EXTENSION = 'neo4j-desktop';
const TEST_ENVIRONMENT_NAME = 'test';

describe('$relate extension', () => {
    test.stdout().it('installs extension from cache', async (ctx) => {
        await InstallCommand.run([
            TEST_EXTENSION_NAME,
            '--version',
            TEST_EXTENSION_VERSION,
            '--environment',
            TEST_ENVIRONMENT_NAME,
        ]);

        expect(ctx.stdout).toContain(TEST_EXTENSION_NAME);
    });

    test.skip()
        .stderr()
        .it('throws when extension not in cache', async () => {
            try {
                await InstallCommand.run([
                    TEST_MISSING_EXTENSION,
                    '-V',
                    TEST_EXTENSION_VERSION,
                    '--environment',
                    'test',
                ]);
            } catch (e) {
                expect(e).toEqual(new NotFoundError('fetch and install neo4j-desktop@1.0.0'));
            }
        });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([TEST_EXTENSION_NAME, '--environment', TEST_ENVIRONMENT_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${TEST_EXTENSION_NAME}@`);
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
