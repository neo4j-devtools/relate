import path from 'path';
import fse from 'fs-extra';
import {TestDbmss} from '../../utils/system';
import {IDbmsInfo} from '../../models';
import {EnvironmentAbstract} from '../environments';
import {DBMS_MANIFEST_FILE} from '../../constants';

describe('LocalDbmss - clone', () => {
    let testDbmss: TestDbmss;
    let env: EnvironmentAbstract;
    let originalDbms: IDbmsInfo;
    let linkedDbmsPath: string;

    beforeAll(async () => {
        testDbmss = await TestDbmss.init(__filename);
        env = testDbmss.environment;
        originalDbms = await testDbmss.createDbms();
        linkedDbmsPath = path.join(testDbmss.environment.dataPath, path.basename(originalDbms.rootPath!));
    });

    afterAll(async () => {
        await testDbmss.teardown();
        await fse.remove(linkedDbmsPath);
    });

    test('Clone a DBMS created by Relate', async () => {
        const clonedName = testDbmss.createName();
        const clonedDbms = await env.dbmss.clone(originalDbms.id, clonedName);

        const originalAfterClone = await env.dbmss.get(originalDbms.id);

        expect(originalAfterClone.name).toEqual(originalDbms.name);
        expect(clonedDbms.name).toEqual(clonedName);
    });

    test('Clone a linked DBMS', async () => {
        await fse.remove(path.join(originalDbms.rootPath!, DBMS_MANIFEST_FILE));
        await fse.move(originalDbms.rootPath!, linkedDbmsPath);

        const linkedName = testDbmss.createName();
        const linkedDbms = await env.dbmss.link(linkedName, linkedDbmsPath!);

        const clonedName = testDbmss.createName();
        const clonedDbms = await env.dbmss.clone(linkedDbms.id, clonedName);

        const linkedAfterClone = await env.dbmss.get(linkedDbms.id);

        expect(linkedAfterClone.name).toEqual(linkedName);
        expect(clonedDbms.name).toEqual(clonedName);
    });
});
