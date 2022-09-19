import {TestDbmss} from '../../utils/system';
import {IDbmsInfo} from '../../models';
import {EnvironmentAbstract} from '../environments';
import {waitForDbmsToBeOnline} from '../../utils/dbmss';

describe('LocalDbmss - info', () => {
    let testDbmss: TestDbmss;
    let env: EnvironmentAbstract;
    let dbms: IDbmsInfo;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        env = testDbmss.environment;
        dbms = await testDbmss.createDbms();
    });

    afterAll(async () => {
        await testDbmss.teardown();
    });

    test('Get DBMS info', async () => {
        const info = await env.dbmss.info([dbms.id]);

        expect(info.toArray()).toEqual([dbms]);
    });

    test('Get DBMS info with online check (offline)', async () => {
        const info = await env.dbmss.info([dbms.id], true);

        expect(info.toArray()).toEqual([
            {
                ...dbms,
                serverStatus: 'offline',
            },
        ]);
    });

    test('Get DBMS info (unknown server status)', async () => {
        await env.dbmss.start([dbms.id]);
        const info = await env.dbmss.info([dbms.id]);

        expect(info.toArray()).toEqual([
            {
                ...dbms,
                serverStatus: 'unknown',
                status: 'started',
            },
        ]);
    });

    test('Get DBMS info with online check (online)', async () => {
        await waitForDbmsToBeOnline({
            ...dbms,
            config: await env.dbmss.getDbmsConfig(dbms.id),
        });
        const info = await env.dbmss.info([dbms.id], true);

        expect(info.toArray()).toEqual([
            {
                ...dbms,
                serverStatus: 'online',
                status: 'started',
            },
        ]);
    });
});
