import fse from 'fs-extra';
import path from 'path';
import {List} from '@relate/types';

import {TestDbmss} from '../../utils/system';
import {EnvironmentAbstract} from '../environments';
import {IProject, IProjectInput, WriteFileFlag} from '../../models';
import {InvalidArgumentError} from '../../errors';
import {envPaths} from '../../utils';
import {PROJECTS_DIR_NAME} from '../../constants';

const TEST_MANIFEST: IProjectInput = {
    name: 'testId',
    dbmss: [],
};
const TEST_CREATED: IProject = {
    ...TEST_MANIFEST,
    root: expect.any(String),
    id: expect.any(String),
};
const testFileName = 'test.txt';
const testOtherFileName = 'test.pem';
const testFile = path.join(envPaths().tmp, testFileName);
const testProjectDir = path.normalize('./foo/bar/baz');
const testDestination = path.normalize(`./foo/bar/baz/${testOtherFileName}`);
const testDestinationOutside = path.normalize(`../foo/bar/baz/${testOtherFileName}`);

describe('LocalProjects', () => {
    let environment: EnvironmentAbstract;
    let testDbmss: TestDbmss;
    let projectId: string;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        environment = testDbmss.environment;

        await fse.ensureFile(testFile);
    });

    afterAll(async () => {
        await testDbmss.teardown();
        await fse.emptyDir(path.join(envPaths().data, PROJECTS_DIR_NAME));
    });

    test('projects.list() - none created', async () => {
        expect(await environment.projects.list()).toEqual(List.from());
    });

    test('projects.create()', async () => {
        const created = await environment.projects.create(TEST_MANIFEST);
        projectId = created.id;

        expect(created).toEqual(TEST_CREATED);
    });

    test('projects.create() - duplicate', () => {
        return expect(environment.projects.create(TEST_MANIFEST)).rejects.toEqual(
            new InvalidArgumentError(`Project ${TEST_MANIFEST.name} already exists`),
        );
    });

    test('projects.list() - with created', async () => {
        expect(await environment.projects.list()).toEqual(List.from([TEST_CREATED]));
    });

    test('projects.addFile() - no destination', async () => {
        expect(await environment.projects.addFile(projectId, testFile)).toEqual({
            name: 'test.txt',
            extension: '.txt',
            downloadToken: expect.any(String),
            directory: '.',
        });
    });

    test('projects.addFile() - destination', async () => {
        expect(await environment.projects.addFile(projectId, testFile, testDestination)).toEqual({
            name: testOtherFileName,
            extension: '.pem',
            downloadToken: expect.any(String),
            directory: testProjectDir,
        });
    });

    test('projects.addFile() - destination outside project', () => {
        return expect(environment.projects.addFile(projectId, testFile, testDestinationOutside)).rejects.toEqual(
            new InvalidArgumentError('Path must point to a location within the project directory'),
        );
    });

    test('projects.addFile() - duplicate', () => {
        return expect(environment.projects.addFile(projectId, testFile, testDestination)).rejects.toEqual(
            new InvalidArgumentError(`File ${testOtherFileName} already exists at that destination`),
        );
    });

    test('projects.addFile() - overwrite existing file', async () => {
        const project = await environment.projects.get(projectId);
        const content = 'This file will contain content.';
        const newTestFileName = 'new-text.txt';
        const newTestFile = path.join(envPaths().tmp, newTestFileName);

        // create new tmp file with content
        await fse.writeFile(newTestFile, content, 'utf8');
        // create new file at root
        expect(await environment.projects.addFile(projectId, newTestFile)).toEqual({
            name: newTestFileName,
            extension: '.txt',
            downloadToken: expect.any(String),
            directory: '.',
        });
        const originalContent = await fse.readFile(path.join(project.root, newTestFileName), 'utf8');
        expect(originalContent).toBe(content);

        // update tmp with new content
        const newContent = 'This file will contain new content.';
        await fse.writeFile(newTestFile, newContent, 'utf8');
        // overwrite
        expect(await environment.projects.addFile(projectId, newTestFile, undefined, true)).toEqual({
            name: newTestFileName,
            extension: '.txt',
            downloadToken: expect.any(String),
            directory: '.',
        });
        const actualContent = await fse.readFile(path.join(project.root, newTestFileName), 'utf8');
        expect(actualContent).toBe(newContent);
    });

    test('projects.addFile() - overwrite non-existing file', () => {
        const nonExistingFile = 'non-existing-file';
        return expect(environment.projects.addFile(projectId, nonExistingFile, undefined, true)).rejects.toEqual(
            new InvalidArgumentError(`File does not exist at that destination`),
        );
    });

    test('projects.writeFile() - override', async () => {
        const expectedContent = 'The file will contain this text.';

        expect(await environment.projects.writeFile(projectId, testFileName, expectedContent)).toEqual({
            name: 'test.txt',
            extension: '.txt',
            downloadToken: expect.any(String),
            directory: '.',
        });

        const project = await environment.projects.get(projectId);
        const actualContent = await fse.readFile(path.join(project.root, testFileName), 'utf8');
        expect(actualContent).toEqual(expectedContent);
    });

    test('projects.writeFile() - append', async () => {
        const appendedContent = 'And this text as well.';
        const expectedContent = `The file will contain this text.${appendedContent}`;

        expect(
            await environment.projects.writeFile(projectId, testFileName, appendedContent, WriteFileFlag.APPEND),
        ).toEqual({
            name: 'test.txt',
            extension: '.txt',
            downloadToken: expect.any(String),
            directory: '.',
        });

        const project = await environment.projects.get(projectId);
        const actualContent = await fse.readFile(path.join(project.root, testFileName), 'utf8');
        expect(actualContent).toEqual(expectedContent);
    });

    test('projects.writeFile() - non existing file', async () => {
        const expectedContent = "If a file doesn't exist it will be created.";
        const nonExistingFile = 'non-existing-file';

        expect(await environment.projects.writeFile(projectId, nonExistingFile, expectedContent)).toEqual({
            name: nonExistingFile,
            extension: '',
            downloadToken: expect.any(String),
            directory: '.',
        });

        const project = await environment.projects.get(projectId);
        const actualContent = await fse.readFile(path.join(project.root, nonExistingFile), 'utf8');
        expect(actualContent).toEqual(expectedContent);
    });

    test('projects.removeFile() - no dir', async () => {
        expect(await environment.projects.removeFile(projectId, testFileName)).toEqual({
            name: 'test.txt',
            extension: '.txt',
            downloadToken: expect.any(String),
            directory: '.',
        });
    });

    test('projects.removeFile() - not exists', () => {
        return expect(environment.projects.removeFile(projectId, testFileName)).rejects.toEqual(
            new InvalidArgumentError(`File ${testFileName} does not exist`),
        );
    });

    test('projects.removeFile() - with dir but not provided', () => {
        return expect(environment.projects.removeFile(projectId, testOtherFileName)).rejects.toEqual(
            new InvalidArgumentError(`File ${testOtherFileName} does not exist`),
        );
    });

    test('projects.removeFile() - with dir', async () => {
        expect(await environment.projects.removeFile(projectId, path.join(testProjectDir, testOtherFileName))).toEqual({
            name: testOtherFileName,
            extension: '.pem',
            downloadToken: expect.any(String),
            directory: testProjectDir,
        });
    });
});
