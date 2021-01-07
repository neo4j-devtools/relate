import fse from 'fs-extra';
import path from 'path';

import {TestEnvironment} from '../../utils/system';
import {DbmsManifestModel, IDbmsInfo} from '../../models';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {DBMS_MANIFEST_FILE} from '../../constants';
import {NEO4J_CONF_DIR, NEO4J_CONF_FILE} from '../environments';
import {PropertiesFile} from '../../system';

describe('LocalDbmss - link', () => {
    let app: TestEnvironment;
    let dbms: IDbmsInfo;
    let tmpDbmsPath: string;
    let tmpDbmsPath2: string;
    let tmpDbmsPath3: string;

    beforeAll(async () => {
        app = await TestEnvironment.init(__filename);
        dbms = await app.createDbms();
        tmpDbmsPath = path.join(app.environment.dataPath, path.basename(dbms.rootPath!));
        tmpDbmsPath2 = `${tmpDbmsPath}-2`;
        tmpDbmsPath3 = `${tmpDbmsPath}-3`;

        await fse.copy(dbms.rootPath!, tmpDbmsPath);
        await fse.copy(dbms.rootPath!, tmpDbmsPath3);
        await fse.remove(path.join(tmpDbmsPath, DBMS_MANIFEST_FILE));
        await fse.remove(path.join(tmpDbmsPath3, DBMS_MANIFEST_FILE));
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
        const oldManifest = await fse.readJSON(path.join(tmpDbmsPath2, DBMS_MANIFEST_FILE), {encoding: 'utf-8'});
        const newManifest = new DbmsManifestModel({
            ...oldManifest,
            name: 'foo',
            tags: ['some tag'],
        });
        await fse.writeJson(path.join(tmpDbmsPath2, DBMS_MANIFEST_FILE), newManifest, {encoding: 'utf8'});

        const result = await app.environment.dbmss.link(tmpDbmsPath2, 'bar');

        expect(result.name).toEqual(newManifest.name);
        expect(result.tags).toEqual(newManifest.tags);
        await expect(app.environment.dbmss.get('bar')).rejects.toThrow(new NotFoundError('DBMS "bar" not found'));
    });

    test('Security plugin config options are not changed if they are already correct', async () => {
        const securityPluginJavaPath = 'plugin-com.neo4j.plugin.jwt.auth.JwtAuthPlugin';
        const originalConfigPath = path.join(tmpDbmsPath3, NEO4J_CONF_DIR, NEO4J_CONF_FILE);
        const originalConfig = await PropertiesFile.readFile(originalConfigPath);

        originalConfig.set('dbms.security.authentication_providers', securityPluginJavaPath);
        originalConfig.set('dbms.security.authorization_providers', securityPluginJavaPath);
        originalConfig.set('dbms.security.procedures.unrestricted', 'jwt.security.*');
        await originalConfig.flush();

        const linkedDbms = await app.environment.dbmss.link(tmpDbmsPath3, 'jwt-plugin');
        const linkedConfig = await app.environment.dbmss.getDbmsConfig(linkedDbms.id);

        const authenticationProviders = linkedConfig.get('dbms.security.authentication_providers');
        const authorizationProviders = linkedConfig.get('dbms.security.authorization_providers');
        const unrestrictedProcedures = linkedConfig.get('dbms.security.procedures.unrestricted');

        expect(authenticationProviders).toEqual(securityPluginJavaPath);
        expect(authorizationProviders).toEqual(securityPluginJavaPath);
        expect(unrestrictedProcedures).toEqual('jwt.security.*');
    });
});
