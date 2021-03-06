import {List} from '@relate/types';
import {Record} from 'neo4j-driver-lite';

import {NotFoundError, NotAllowedError, DbmsQueryError} from '../../errors';
import {EnvironmentAbstract} from '../../entities/environments';
import {DBMS_STATUS} from '../../constants';
import {IQueryTarget} from '../../models';

export const dbReadQuery = async (
    environment: EnvironmentAbstract,
    target: IQueryTarget,
    query: string,
    params: any = {},
): Promise<List<Record>> => {
    const {dbmss} = environment;

    const dbmsInfo = (await dbmss.info([target.dbmsNameOrId])).first.getOrElse(() => {
        throw new NotFoundError(`DBMS ${target.dbmsNameOrId} not found`);
    });

    if (dbmsInfo.status === DBMS_STATUS.STOPPED) {
        throw new NotAllowedError('Cannot connect to stopped DBMS', ['Start the DBMS']);
    }

    const driver = await dbmss.getDriverInstance(dbmsInfo.id, {
        credentials: target.accessToken,
        principal: target.dbmsUser,
        scheme: 'basic',
    });

    try {
        const result = await dbmss.runReadQuery(driver, query, params, {database: target.database});
        const ret = List.of(result.records);
        return ret;
    } catch (e) {
        throw new DbmsQueryError('Unable to run a database read query', e.message);
    } finally {
        driver.close();
    }
};

export const dbWriteQuery = async (
    environment: EnvironmentAbstract,
    target: IQueryTarget,
    query: string,
    params: any = {},
): Promise<List<Record>> => {
    const {dbmss} = environment;

    const dbmsInfo = (await dbmss.info([target.dbmsNameOrId])).first.getOrElse(() => {
        throw new NotFoundError(`DBMS ${target.dbmsNameOrId} not found`);
    });

    if (dbmsInfo.status === DBMS_STATUS.STOPPED) {
        throw new NotAllowedError('Cannot connect to stopped DBMS', ['Start the DBMS']);
    }

    const driver = await dbmss.getDriverInstance(dbmsInfo.id, {
        credentials: target.accessToken,
        principal: target.dbmsUser,
        scheme: 'basic',
    });

    try {
        const result = await dbmss.runWriteQuery(driver, query, params, {database: target.database});
        const ret = List.of(result.records);
        return ret;
    } catch (e) {
        throw new DbmsQueryError('Unable to run a database write query', e.message);
    } finally {
        driver.close();
    }
};
