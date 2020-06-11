import fse from 'fs-extra';
import path from 'path';
import {List} from '@relate/types';

import {TestDbmss} from '../../utils/system';
import {EnvironmentAbstract} from '../environments';
import {IProject, IProjectManifest} from '../../models';
import {InvalidArgumentError} from '../../errors';
import {envPaths} from '../../utils';
import {PROJECTS_DIR_NAME} from '../../constants';

const testId = 'testId';

jest.mock('uuid', () => ({
    v4: () => testId,
}));

const TEST_MANIFEST: IProjectManifest = {
    name: 'test',
    dbmss: [],
};
const TEST_CREATED: IProject = {
    ...TEST_MANIFEST,
    id: testId,
    root: expect.any(String),
};
const testFileName = 'test.txt';
const testOtherFileName = 'test.pem';
const testFile = path.join(envPaths().tmp, testFileName);
const testProjectDir = './foo/bar/baz';
const testDestination = `./foo/bar/baz/${testOtherFileName}`;

describe('LocalProjects - list', () => {
    let environment: EnvironmentAbstract;
    let testDbmss: TestDbmss;

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
        expect(await environment.projects.create(TEST_MANIFEST)).toEqual(TEST_CREATED);
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
        expect(await environment.projects.addFile(testId, testFile)).toEqual({
            name: 'test.txt',
            extension: '.txt',
            directory: '.',
        });
    });

    test('projects.addFile() - destination', async () => {
        expect(await environment.projects.addFile(testId, testFile, testDestination)).toEqual({
            name: testOtherFileName,
            extension: '.pem',
            directory: testProjectDir,
        });
    });

    test('projects.addFile() - duplicate', () => {
        return expect(environment.projects.addFile(testId, testFile, testDestination)).rejects.toEqual(
            new InvalidArgumentError(`File ${testOtherFileName} already exists at that destination`),
        );
    });

    test('projects.removeFile() - no dir', async () => {
        expect(await environment.projects.removeFile(testId, testFileName)).toEqual({
            name: 'test.txt',
            extension: '.txt',
            directory: '.',
        });
    });

    test('projects.removeFile() - not exists', () => {
        return expect(environment.projects.removeFile(testId, testFileName)).rejects.toEqual(
            new InvalidArgumentError(`File ${testFileName} does not exists`),
        );
    });

    test('projects.removeFile() - with dir', async () => {
        expect(await environment.projects.removeFile(testId, path.join(testProjectDir, testOtherFileName))).toEqual({
            name: testOtherFileName,
            extension: '.pem',
            directory: testProjectDir,
        });
    });
});
