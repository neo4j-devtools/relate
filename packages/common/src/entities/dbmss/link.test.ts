import fse from 'fs-extra';
import path from 'path';

import {TestEnvironment} from '../../utils/system';
import {DbmsManifestModel, IDbmsInfo} from '../../models';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {DBMS_MANIFEST_FILE} from '../../constants';

describe('LocalDbmss - link', () => {
    let app: TestEnvironment;
    let dbms: IDbmsInfo;
    let tmpDbmsPath: string;
    let tmpDbmsPath2: string;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
        dbms = await app.createDbms();
        tmpDbmsPath = path.join(app.environment.dataPath, path.basename(dbms.rootPath!));
        tmpDbmsPath2 = `${tmpDbmsPath}-2`;

        await fse.copy(dbms.rootPath!, tmpDbmsPath);
        await fse.remove(path.join(tmpDbmsPath, DBMS_MANIFEST_FILE));
    });

    afterAll(() => app.teardown());

    test('Fails when linking bad path', async () => {
        await expect(app.environment.dbmss.link('/path/to/nowhere', 'foo')).rejects.toThrow(
            new InvalidArgumentError(
                // eslint-disable-next-line max-len
                'Path "/path/to/nowhere" does not seem to be a valid neo4j DBMS.\n\nSuggested Action(s):\n- Use a valid path',
            ),
        );
    });

    test('Fails when linking existing name', async () => {
        await expect(app.environment.dbmss.link(tmpDbmsPath, dbms.name)).rejects.toThrow(
            new InvalidArgumentError(
                `DBMS "${dbms.name}" already exists.\n\nSuggested Action(s):\n- Use a unique name`,
            ),
        );
    });

    test('Succeeds when linking correct path', async () => {
        const result = await app.environment.dbmss.link(tmpDbmsPath, 'bar');

        expect(result.name).toEqual('bar');
    });

    test('Is correctly discovered after linking', async () => {
        const result = await app.environment.dbmss.get('bar');

        expect(result.name).toEqual('bar');
    });

    test('Fails when linking already managed', async () => {
        await expect(app.environment.dbmss.link(tmpDbmsPath, 'baz')).rejects.toThrow(
            new InvalidArgumentError('DBMS "bar" already managed by relate'),
        );
    });

    test('Is not discovered if target is removed or missing', async () => {
        await fse.move(tmpDbmsPath, tmpDbmsPath2);
        await expect(app.environment.dbmss.get('bar')).rejects.toThrow(new NotFoundError('DBMS "bar" not found'));
    });

    test('Symlink is updated if linking again a DBMS that was moved', async () => {
        const result = await app.environment.dbmss.link(tmpDbmsPath2, 'bar');
        const targetPath = await fse.readlink(result.rootPath!);

        expect(result.name).toEqual('bar');
        expect(targetPath.replace(/[/\\]$/, '')).toEqual(tmpDbmsPath2);
    });

    test('Target directory is not deleted when uninstalling', async () => {
        const result = await app.environment.dbmss.uninstall('bar');
        const targetPathExists = await fse.pathExists(tmpDbmsPath2);

        expect(result.name).toEqual('bar');
        expect(targetPathExists).toEqual(true);
        await expect(app.environment.dbmss.get('bar')).rejects.toThrow(new NotFoundError('DBMS "bar" not found'));
    });

    test('Existing manifest is preferred over the given name', async () => {
        const oldManifest = await fse.readJson(path.join(tmpDbmsPath2, DBMS_MANIFEST_FILE));
        const newManifest = new DbmsManifestModel({
            ...oldManifest,
            name: 'foo',
            tags: ['some tag'],
        });
        await fse.writeJson(path.join(tmpDbmsPath2, DBMS_MANIFEST_FILE), newManifest);

        const result = await app.environment.dbmss.link(tmpDbmsPath2, 'bar');

        expect(result.name).toEqual(newManifest.name);
        expect(result.tags).toEqual(newManifest.tags);
        await expect(app.environment.dbmss.get('bar')).rejects.toThrow(new NotFoundError('DBMS "bar" not found'));
    });
});
