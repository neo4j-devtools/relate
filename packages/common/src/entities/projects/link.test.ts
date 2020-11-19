import fse from 'fs-extra';
import path from 'path';

import {TestDbmss} from '../../utils/system';
import {DbmsManifestModel, IProject} from '../../models';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {PROJECT_MANIFEST_FILE} from '../../constants';
import {EnvironmentAbstract} from '../environments';

describe('LocalProjects - link', () => {
    let environment: EnvironmentAbstract;
    let testDbmss: TestDbmss;
    let project: IProject;
    let tmpPath: string;
    let tmpPath2: string;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        environment = testDbmss.environment;
        project = await testDbmss.environment.projects.create({
            name: __filename,
        });

        tmpPath = path.join(environment.dataPath, path.basename(project.root));
        tmpPath2 = `${tmpPath}-2`;

        await fse.copy(project.root, tmpPath);
        await fse.remove(path.join(tmpPath, PROJECT_MANIFEST_FILE));
    });

    afterAll(async () => {
        await fse.remove(tmpPath).catch(null);
        await fse.remove(tmpPath2).catch(null);
        await fse.remove(project.root).catch(null);
    });

    test('Fails when linking bad path', async () => {
        await expect(environment.projects.link('/path/to/nowhere', 'foo')).rejects.toThrow(
            new InvalidArgumentError(
                // eslint-disable-next-line max-len
                'Path "/path/to/nowhere" does not exist.\n\nSuggested Action(s):\n- Use a valid path',
            ),
        );
    });

    test('Fails when linking existing name', async () => {
        await expect(environment.projects.link(tmpPath, project.name)).rejects.toThrow(
            new InvalidArgumentError(
                `Project "${project.name}" already exists.\n\nSuggested Action(s):\n- Use a unique name`,
            ),
        );
    });

    test('Succeeds when linking correct path', async () => {
        const result = await environment.projects.link(tmpPath, 'bar');

        expect(result.name).toEqual('bar');
    });

    test('Is correctly discovered after linking', async () => {
        const result = await environment.projects.get('bar');

        expect(result.name).toEqual('bar');
    });

    test('Fails when linking already managed', async () => {
        await expect(environment.projects.link(tmpPath, 'baz')).rejects.toThrow(
            new InvalidArgumentError('Project "bar" already managed by relate'),
        );
    });

    test('Is not discovered if target is removed or missing', async () => {
        await fse.move(tmpPath, tmpPath2);
        await expect(environment.projects.get('bar')).rejects.toThrow(new NotFoundError('Could not find project bar'));
    });

    test('Symlink is updated if linking again a project that was moved', async () => {
        const result = await environment.projects.link(tmpPath2, 'bar');
        const targetPath = await fse.readlink(result.root);

        expect(result.name).toEqual('bar');
        expect(targetPath).toEqual(tmpPath2);
    });

    test('Target directory is not deleted when unlinking', async () => {
        const result = await environment.projects.unlink('bar');
        const targetPathExists = await fse.pathExists(tmpPath2);

        expect(result.name).toEqual('bar');
        expect(targetPathExists).toEqual(true);
        await expect(environment.projects.get('bar')).rejects.toThrow(new NotFoundError('Could not find project bar'));
    });

    test('Existing manifest is preferred over the given name', async () => {
        const oldManifest = await fse.readJson(path.join(tmpPath2, PROJECT_MANIFEST_FILE));
        const newManifest = new DbmsManifestModel({
            ...oldManifest,
            name: 'foo',
            tags: ['some tag'],
        });
        await fse.writeJson(path.join(tmpPath2, PROJECT_MANIFEST_FILE), newManifest);

        const result = await environment.projects.link(tmpPath2, 'bar');

        expect(result.name).toEqual(newManifest.name);
        expect(result.tags).toEqual(newManifest.tags);
        await expect(environment.projects.get('bar')).rejects.toThrow(new NotFoundError('Could not find project bar'));
    });
});
