import {test} from '@oclif/test';
import path from 'path';
import {envPaths, EXTENSION_DIR_NAME, NotFoundError} from '@relate/common';

import InstallCommand from '../../commands/extension/install';
import UninstallCommand from '../../commands/extension/uninstall';

const TEST_EXTENSION_NAME = 'neo4j-browser';
const TEST_MISSING_EXTENSION = 'neo4j-desktop';

describe('$relate extension', () => {
    test.stdout().it('installs extension from cache', async (ctx) => {
        await InstallCommand.run([TEST_EXTENSION_NAME, '--version=1.0.0']);

        expect(ctx.stdout).toContain(TEST_EXTENSION_NAME);
    });

    // @todo - needs to be updated, we try to download the extension now
    // instead of throwing here
    test.skip()
        .stderr()
        .it('throws when extension not in cache', async () => {
            try {
                await InstallCommand.run([TEST_MISSING_EXTENSION, '--version=1.0.0']);
            } catch (e) {
                expect(e).toEqual(new NotFoundError('fetch and install neo4j-desktop@*'));
            }
        });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([TEST_EXTENSION_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${TEST_EXTENSION_NAME}@`);
    });

    test.stdout().it('installs extension from file', async (ctx) => {
        const extensionPath = path.join(envPaths().cache, EXTENSION_DIR_NAME, `${TEST_EXTENSION_NAME}.tgz`);
        await InstallCommand.run([TEST_EXTENSION_NAME, '--version', extensionPath]);

        expect(ctx.stdout).toContain(TEST_EXTENSION_NAME);
    });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([TEST_EXTENSION_NAME]);

        expect(ctx.stdout).toContain(`Uninstalled ${TEST_EXTENSION_NAME}@`);
    });
});
