import {test} from '@oclif/test';
import path from 'path';
import {envPaths, EXTENSION_DIR_NAME, NotFoundError} from '@relate/common';

import InstallCommand from '../../commands/extension/install';
import UninstallCommand from '../../commands/extension/uninstall';

const TEST_EXTENSION_TYPE = 'STATIC';
const TEST_EXTENSION_NAME = 'neo4j-insight';
const TEST_MISSING_EXTENSION = 'neo4j-desktop';

describe('$relate extension', () => {
    test.stdout().it('installs extension from cache', async (ctx) => {
        await InstallCommand.run([TEST_EXTENSION_NAME]);

        expect(ctx.stdout).toEqual(expect.stringContaining(TEST_EXTENSION_NAME));
    });

    test.stderr().it('throws when extension not in cache', async () => {
        try {
            await InstallCommand.run([TEST_MISSING_EXTENSION]);
        } catch (e) {
            expect(e).toEqual(new NotFoundError('fetch and install neo4j-desktop@*'));
        }
    });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([TEST_EXTENSION_NAME, '--type', TEST_EXTENSION_TYPE]);

        expect(ctx.stdout).toEqual(expect.stringContaining(TEST_EXTENSION_NAME));
    });

    test.stdout().it('installs extension from file', async (ctx) => {
        const extensionPath = path.join(envPaths().cache, EXTENSION_DIR_NAME, `${TEST_EXTENSION_NAME}.zip`);
        await InstallCommand.run([TEST_EXTENSION_NAME, '--version', extensionPath]);

        expect(ctx.stdout).toEqual(expect.stringContaining(TEST_EXTENSION_NAME));
    });

    test.stdout().it('uninstalls extension', async (ctx) => {
        await UninstallCommand.run([TEST_EXTENSION_NAME, '--type', TEST_EXTENSION_TYPE]);

        expect(ctx.stdout).toEqual(expect.stringContaining(TEST_EXTENSION_NAME));
    });
});
