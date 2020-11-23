import fse from 'fs-extra';
import path from 'path';

import {TestEnvironment} from '../../utils/system';
import {IDbmsInfo} from '../../models';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {DBMS_MANIFEST_FILE} from '../../constants';

describe('LocalDbmss - link', () => {
    let app: TestEnvironment;
    let dbms: IDbmsInfo;
    let tmpDbmsPath: string;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
        dbms = await app.createDbms();
        tmpDbmsPath = path.join(app.environment.dataPath, path.basename(dbms.rootPath!));

        await fse.remove(path.join(dbms.rootPath!, DBMS_MANIFEST_FILE));
        await fse.move(dbms.rootPath!, tmpDbmsPath);
    });

    afterAll(() => app.teardown());

    test('Fails when linking bad path', async () => {
        await expect(app.environment.dbmss.link('foo', '/path/to/nowhere')).rejects.toThrow(
            new InvalidArgumentError(
                // eslint-disable-next-line max-len
                'Path "/path/to/nowhere" does not seem to be a valid neo4j DBMS.\n\nSuggested Action(s):\n- Use a valid path',
            ),
        );
    });

    test('Succeeds when linking correct path', async () => {
        const result = await app.environment.dbmss.link('bar', tmpDbmsPath);

        expect(result.name).toEqual('bar');
    });

    test('Is correctly discovered after linking', async () => {
        const result = await app.environment.dbmss.get('bar');

        expect(result.name).toEqual('bar');
    });

    test('Fails when linking existing name', async () => {
        await expect(app.environment.dbmss.link('bar', tmpDbmsPath)).rejects.toThrow(
            new InvalidArgumentError('DBMS "bar" already exists.\n\nSuggested Action(s):\n- Use a unique name'),
        );
    });

    test('Fails when linking already managed', async () => {
        await expect(app.environment.dbmss.link('baz', tmpDbmsPath)).rejects.toThrow(
            new InvalidArgumentError('DBMS "baz" already managed by relate'),
        );
    });

    test('Is not discovered if target is removed or missing', async () => {
        await fse.remove(tmpDbmsPath);
        await expect(app.environment.dbmss.get('bar')).rejects.toThrow(new NotFoundError('DBMS "bar" not found'));
    });
});
