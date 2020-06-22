import * as rxjsOps from 'rxjs/operators';
import {List} from '@relate/types';

import {NotFoundError, NotAllowedError} from '../../errors';
import {EnvironmentAbstract} from '../../entities/environments';
import {DBMS_STATUS} from '../../constants';
import {TapestryJSONResponse} from '../../entities/dbmss';

export interface IQueryTarget {
    environment: EnvironmentAbstract;
    dbmsId: string;
    dbmsUser: string;
    accessToken: string;
}

export const systemDbQuery = async (
    target: IQueryTarget,
    query: string,
    params: any = {},
): Promise<List<TapestryJSONResponse>> => {
    const {dbmss} = target.environment;

    const dbmsInfo = (await dbmss.info([target.dbmsId])).first.getOrElse(() => {
        throw new NotFoundError(`DBMS ${target.dbmsId} not found`);
    });

    if (dbmsInfo.status === DBMS_STATUS.STOPPED) {
        throw new NotAllowedError('Cannot connect to stopped DBMS', ['Start the DBMS']);
    }

    const driver = await dbmss.getJSONDriverInstance(dbmsInfo.id, {
        credentials: target.accessToken,
        principal: target.dbmsUser,
        scheme: 'basic',
    });

    return dbmss
        .runQuery(driver, query, params, 3, {db: 'system'})
        .pipe(rxjsOps.reduce((agg, next) => agg.concat(next), List.of<TapestryJSONResponse>([])))
        .toPromise()
        .finally(() => driver.shutDown().toPromise());
};
