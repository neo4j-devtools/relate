import {TestDbmss} from '../../utils/system';
import {IDbmsInfo} from '../../models';
import {InvalidArgumentError, NotFoundError} from '../../errors';

describe('LocalEnvironment - link', () => {
    let testDbmss: TestDbmss;
    let instance: IDbmsInfo;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        instance = await testDbmss.createDbms();
    });

    afterAll(() => testDbmss.teardown());

    test('Fails when linking bad path', async () => {
        await expect(testDbmss.environment.dbmss.link('foo', '/path/to/nowhere')).rejects.toThrow(
            new InvalidArgumentError(
                // eslint-disable-next-line max-len
                'Path "/path/to/nowhere" does not seem to be a valid neo4j DBMS.\n\nSuggested Action(s):\n- Use a valid path',
            ),
        );
    });

    test('Succeeds when linking correct path', async () => {
        const result = await testDbmss.environment.dbmss.link('bar', instance.rootPath!);

        expect(result.name).toEqual('bar');
    });

    test('Is correctly discovered after linking', async () => {
        const result = await testDbmss.environment.dbmss.get('bar');

        expect(result.name).toEqual('bar');
    });

    test('Fails when linking existing name', async () => {
        await expect(testDbmss.environment.dbmss.link('bar', instance.rootPath!)).rejects.toThrow(
            new InvalidArgumentError('DBMS "bar" already exists.\n\nSuggested Action(s):\n- Use a unique name'),
        );
    });

    test('Is not discovered if target is removed or missing', async () => {
        await testDbmss.environment.dbmss.uninstall(instance.id);
        await expect(testDbmss.environment.dbmss.get('bar')).rejects.toThrow(new NotFoundError('DBMS "bar" not found'));
    });
});
