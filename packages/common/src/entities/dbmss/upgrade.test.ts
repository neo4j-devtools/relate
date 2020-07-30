import {InvalidArgumentError} from '../../errors';
import {TestDbmss} from '../../utils/system';
import {IDbmsInfo} from '../../models';
import {EnvironmentAbstract} from '../environments';

describe('LocalDbmss - upgrade', () => {
    let testDbmss: TestDbmss;
    let env: EnvironmentAbstract;
    let dbms404: IDbmsInfo;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        env = testDbmss.environment;
        dbms404 = await env.dbmss.install(testDbmss.createName(), '4.0.4');
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
        const upgraded = await env.dbmss.upgrade(dbms404.id, '4.0.5', false, true);

        expect(upgraded.version).toEqual('4.0.5');
        expect(upgraded.id).toEqual(dbms404.id);
    });
});
