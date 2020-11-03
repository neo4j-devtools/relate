import {test} from '@oclif/test';
import {InvalidArgumentError, envPaths, TestDbmss, PROJECTS_DIR_NAME} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';

import StartCommand from '../../commands/dbms/start';
import ListCommand from '../../commands/project/list';
import InitCommand from '../../commands/project/init';
import ListFilesCommand from '../../commands/project/list-files';
import AddFileCommand from '../../commands/project/add-file';
import RemoveFileCommand from '../../commands/project/remove-file';
import ListDbmssCommand from '../../commands/project/list-dbmss';
import AddDbmsCommand from '../../commands/project/add-dbms';
import RemoveDbmsCommand from '../../commands/project/remove-dbms';

const TEST_PROJECT_NAME = 'Cli Project';
const TEST_FILE_NAME = 'cliProject.tmp';
const TEST_PROJECT_DIR = path.join(envPaths().tmp, TEST_PROJECT_NAME);
const TEST_PROJECT_FILE = path.join(envPaths().tmp, TEST_FILE_NAME);
const TEST_FILE_OTHER_NAME = 'cliProject.pem';
const TEST_FILE_DESTINATION_DIR = path.normalize('foo/bar');
const TEST_FILE_DESTINATION = path.normalize(path.join(TEST_FILE_DESTINATION_DIR, TEST_FILE_OTHER_NAME));

jest.mock('../../prompts', () => {
    return {
        passwordPrompt: (): Promise<string> => Promise.resolve(TestDbmss.DBMS_CREDENTIALS),
    };
});

let TEST_DB_NAME: string;
let TEST_ENVIRONMENT_ID: string;

describe('$relate project', () => {
    let dbmss: TestDbmss;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {name} = await dbmss.createDbms();

        TEST_DB_NAME = name;
        TEST_ENVIRONMENT_ID = dbmss.environment.id;

        await fse.ensureDir(TEST_PROJECT_DIR);
        await fse.ensureFile(TEST_PROJECT_FILE);
        await StartCommand.run([TEST_DB_NAME, '--environment', TEST_ENVIRONMENT_ID]);
    });

    afterAll(async () => {
        await dbmss.teardown();
        await fse.remove(path.join(envPaths().data, PROJECTS_DIR_NAME, TEST_PROJECT_NAME));
        await fse.remove(TEST_PROJECT_DIR);
        await fse.remove(TEST_PROJECT_FILE);
    });

    test.stdout().it('lists no projects when none created', async (ctx) => {
        await ListCommand.run(['--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).not.toContain(TEST_DB_NAME);
    });

    test.stdout().it('inits a new project', async (ctx) => {
        await InitCommand.run([TEST_PROJECT_DIR, '--environment', TEST_ENVIRONMENT_ID, '--name', TEST_PROJECT_NAME]);
        expect(ctx.stdout).toContain(TEST_PROJECT_NAME);
    });

    test.stdout().it('lists projects when created', async (ctx) => {
        await ListCommand.run(['--environment', TEST_ENVIRONMENT_ID]);
        expect(ctx.stdout).toContain(TEST_PROJECT_NAME);
    });

    test.stdout().it('lists no files when none added', async (ctx) => {
        await ListFilesCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--project', TEST_PROJECT_NAME]);
        expect(ctx.stdout).not.toContain(TEST_FILE_NAME);
        expect(ctx.stdout).not.toContain(TEST_FILE_OTHER_NAME);
    });

    test.stdout().it('adds file without destination', async (ctx) => {
        await AddFileCommand.run([
            TEST_PROJECT_FILE,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
        ]);
        expect(ctx.stdout).toContain(TEST_FILE_NAME);
        expect(ctx.stdout).not.toContain(TEST_FILE_OTHER_NAME);
    });

    test.stderr().it('does not duplicate', () => {
        return expect(
            AddFileCommand.run([
                TEST_PROJECT_FILE,
                '--environment',
                TEST_ENVIRONMENT_ID,
                '--project',
                TEST_PROJECT_NAME,
            ]),
        ).rejects.toEqual(new InvalidArgumentError(`File ${TEST_FILE_NAME} already exists at that destination`));
    });

    test.stdout().it('does overwrite file with overwite flag', async (ctx) => {
        await AddFileCommand.run([
            TEST_PROJECT_FILE,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
            '--overwrite',
        ]);
        expect(ctx.stdout).toContain(TEST_FILE_NAME);
        expect(ctx.stdout).not.toContain(TEST_FILE_OTHER_NAME);
    });

    test.stdout().it('adds file with destination', async (ctx) => {
        await AddFileCommand.run([
            TEST_PROJECT_FILE,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
            `--destination=${TEST_FILE_DESTINATION}`,
        ]);
        expect(ctx.stdout).not.toContain(TEST_FILE_NAME);
        expect(ctx.stdout).toContain(TEST_FILE_OTHER_NAME);
        expect(ctx.stdout).toContain(TEST_FILE_DESTINATION_DIR);
    });

    test.stdout().it('lists files when added', async (ctx) => {
        await ListFilesCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--project', TEST_PROJECT_NAME]);
        expect(ctx.stdout).toContain(TEST_FILE_NAME);
        expect(ctx.stdout).toContain(TEST_FILE_OTHER_NAME);
    });

    test.stdout().it('removes file without destination', async (ctx) => {
        await RemoveFileCommand.run([
            TEST_FILE_NAME,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
        ]);
        expect(ctx.stdout).toContain(TEST_FILE_NAME);
        expect(ctx.stdout).not.toContain(TEST_FILE_OTHER_NAME);
    });

    test.stdout().it('removes file with destination', async (ctx) => {
        await RemoveFileCommand.run([
            TEST_FILE_DESTINATION,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
        ]);
        expect(ctx.stdout).not.toContain(TEST_FILE_NAME);
        expect(ctx.stdout).toContain(TEST_FILE_OTHER_NAME);
        expect(ctx.stdout).toContain(TEST_FILE_DESTINATION_DIR);
    });

    test.stdout().it('lists no files when all removed', async (ctx) => {
        await ListFilesCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--project', TEST_PROJECT_NAME]);
        expect(ctx.stdout).not.toContain(TEST_FILE_NAME);
        expect(ctx.stdout).not.toContain(TEST_FILE_OTHER_NAME);
    });

    test.stdout().it('lists no dbmss when none added', async (ctx) => {
        await ListDbmssCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--project', TEST_PROJECT_NAME]);
        expect(ctx.stdout).not.toContain(TEST_DB_NAME);
    });

    test.stdout().it('Adds dbms', async (ctx) => {
        await AddDbmsCommand.run([
            TEST_DB_NAME,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
            `--name=${TEST_DB_NAME}`,
            `--user=neo4j`,
        ]);
        expect(ctx.stdout).toContain(TEST_DB_NAME);
    });

    test.stdout().it('lists dbmss when added', async (ctx) => {
        await ListDbmssCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--project', TEST_PROJECT_NAME]);
        expect(ctx.stdout).toContain(TEST_DB_NAME);
    });

    test.stdout().it('Does not duplicate dbms', () => {
        return expect(
            AddDbmsCommand.run([
                TEST_DB_NAME,
                '--environment',
                TEST_ENVIRONMENT_ID,
                '--project',
                TEST_PROJECT_NAME,
                `--name=${TEST_DB_NAME}`,
                `--user=neo4j`,
            ]),
        ).rejects.toEqual(new InvalidArgumentError(`Dbms "${TEST_DB_NAME}" already exists in project`));
    });

    test.stdout().it('Removes dbms', async (ctx) => {
        await RemoveDbmsCommand.run([
            TEST_DB_NAME,
            '--environment',
            TEST_ENVIRONMENT_ID,
            '--project',
            TEST_PROJECT_NAME,
        ]);
        expect(ctx.stdout).toContain(TEST_DB_NAME);
    });

    test.stdout().it('lists no dbmss when removed', async (ctx) => {
        await ListDbmssCommand.run(['--environment', TEST_ENVIRONMENT_ID, '--project', TEST_PROJECT_NAME]);
        expect(ctx.stdout).not.toContain(TEST_DB_NAME);
    });
});
