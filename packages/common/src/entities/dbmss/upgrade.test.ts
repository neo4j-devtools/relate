import {InvalidArgumentError} from '../../errors';
import {TestDbmss} from '../../utils/system';
import {IDbmsInfo} from '../../models';
import {EnvironmentAbstract} from '../environments';

jest.setTimeout(240000);

describe('LocalDbmss - upgrade', () => {
    let testDbmss: TestDbmss;
    let env: EnvironmentAbstract;
    let dbms404: IDbmsInfo;
    let dbms35: IDbmsInfo;
    let dbms352: IDbmsInfo;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        env = testDbmss.environment;
        dbms404 = await env.dbmss.install(testDbmss.createName(), '4.0.4');
        dbms35 = await env.dbmss.install(testDbmss.createName(), '3.5.19');
        dbms352 = await env.dbmss.install(testDbmss.createName(), '3.5.19');
    });

    afterAll(async () => {
        await testDbmss.teardown();
    });

    test('Before upgrading', async () => {
        const dbms = await env.dbmss.get(dbms404.id);

        expect(dbms.version).toEqual('4.0.4');
    });

    test('Upgrading to lower', async () => {
        const message = 'Target version must be greater than 4.0.4.\n\nSuggested Action(s):\n- Use valid version';

        await expect(env.dbmss.upgrade(dbms404.id, '4.0.3')).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('Upgrading to same', async () => {
        const message = 'Target version must be greater than 4.0.4.\n\nSuggested Action(s):\n- Use valid version';

        await expect(env.dbmss.upgrade(dbms404.id, '4.0.4')).rejects.toThrow(new InvalidArgumentError(message));
    });

    test('Upgrading running', async () => {
        await env.dbmss.start([dbms404.id]);

        const message = 'Can only upgrade stopped dbms.\n\nSuggested Action(s):\n- Stop dbms';

        await expect(env.dbmss.upgrade(dbms404.id, '4.0.5')).rejects.toThrow(new InvalidArgumentError(message));
        await env.dbmss.stop([dbms404.id]);
    });

    test('Upgrading to higher', async () => {
        const upgraded = await env.dbmss.upgrade(dbms404.id, '4.0.5', true, false, false);

        expect(upgraded.version).toEqual('4.0.5');
        expect(upgraded.id).toEqual(dbms404.id);
    });

    test('Preserves config when upgrading to higher', async () => {
        const config = await env.dbmss.getDbmsConfig(dbms404.id);

        config.set('foo', 'bar');
        await config.flush();

        const upgraded = await env.dbmss.upgrade(dbms404.id, '4.0.6', true, false, false);
        const upgradedConfig = await env.dbmss.getDbmsConfig(dbms404.id);

        expect(upgraded.version).toEqual('4.0.6');
        expect(upgraded.id).toEqual(dbms404.id);
        expect(upgradedConfig.get('foo')).toEqual('bar');
    });

    test('Upgrading major', async () => {
        const upgraded = await env.dbmss.upgrade(dbms35.id, '4.1.0', false, false, false);

        expect(upgraded.version).toEqual('4.1.0');
        expect(upgraded.id).toEqual(dbms35.id);
    });

    test('Preserves config when upgrading major', async () => {
        const config = await env.dbmss.getDbmsConfig(dbms352.id);

        config.set('foo', 'bar');
        await config.flush();

        const upgraded = await env.dbmss.upgrade(dbms352.id, '4.1.0', false, false, false);
        const upgradedConfig = await env.dbmss.getDbmsConfig(dbms352.id);

        expect(upgraded.version).toEqual('4.1.0');
        expect(upgraded.id).toEqual(dbms352.id);
        expect(upgradedConfig.get('foo')).toEqual('bar');
    });
});
