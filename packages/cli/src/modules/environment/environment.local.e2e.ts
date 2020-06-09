import {test} from '@oclif/test';
import fse from 'fs-extra';
import path from 'path';
import {ENVIRONMENTS_DIR_NAME, envPaths} from '@relate/common';

import InitCommand from '../../commands/environment/init';
import UseCommand from '../../commands/environment/use';
import ListCommand from '../../commands/environment/list';

const TEST_ENV_NAME = 'test';
const ENV_NAME = 'test2';

describe('$relate environment', () => {
    afterAll(async () => {
        await fse.unlink(path.join(envPaths().config, ENVIRONMENTS_DIR_NAME, `${ENV_NAME}.json`));
    });

    describe('list, before init', () => {
        test.stdout().it('does not list test environment', async (ctx) => {
            await ListCommand.run();

            expect(ctx.stdout).not.toContain(ENV_NAME);
        });
    });

    describe('init', () => {
        test.stderr().it('creates environment', async (ctx) => {
            await InitCommand.run([`--name=${ENV_NAME}`, '--type=LOCAL']);

            expect(ctx.stderr).toContain('done');
        });
    });

    describe('list, after init', () => {
        test.stdout().it('does list test environment', async (ctx) => {
            await ListCommand.run();

            expect(ctx.stdout).toContain(ENV_NAME);
        });
    });

    describe('use', () => {
        test.stdout().it('uses new environment', async (ctx) => {
            await UseCommand.run([ENV_NAME]);

            expect(ctx.stdout).toContain(`Environment "${ENV_NAME}" is now set as default.`);
        });

        test.stdout().it('switches back', async (ctx) => {
            await UseCommand.run([TEST_ENV_NAME]);

            expect(ctx.stdout).toContain(`Environment "${TEST_ENV_NAME}" is now set as default.`);
        });
    });
});
