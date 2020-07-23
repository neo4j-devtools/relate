import {List, Str} from '@relate/types';
import {Driver, DRIVER_HEADERS, DRIVER_RESULT_TYPE, IAuthToken, JsonUnpacker, IQueryMeta} from '@huboneo/tapestry';
import * as rxjs from 'rxjs';
import * as rxjsOps from 'rxjs/operators';

import {IDbms, IDbmsInfo, IDbmsVersion} from '../../models';

import {EnvironmentAbstract, NEO4J_EDITION} from '../environments';
import {PropertiesFile} from '../../system/files';
import {
    ConnectionError,
    DbmsQueryError,
    ErrorAbstract,
    InvalidConfigError,
    NotAllowedError,
    NotFoundError,
} from '../../errors';
import {CONNECTION_RETRY_STEP, DBMS_STATUS, HOOK_EVENTS, MAX_CONNECTION_RETRIES} from '../../constants';
import {emitHookEvent} from '../../utils';
import {IRelateFilter} from '../../utils/generic';

export type TapestryJSONResponse<Res = any> = {
    header: {fields: string[]};
    type: DRIVER_RESULT_TYPE;
    data: Res;
};

export abstract class DbmssAbstract<Env extends EnvironmentAbstract> {
    public dbmss: {[id: string]: IDbms} = {};

    constructor(protected readonly environment: Env) {}

    abstract versions(limited?: boolean, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbmsVersion>>;

    abstract install(
        name: string,
        credentials: string,
        version: string,
        edition?: NEO4J_EDITION,
        noCaching?: boolean,
        limited?: boolean,
    ): Promise<string>;

    abstract link(name: string, rootPath: string): Promise<IDbmsInfo>;

    abstract uninstall(dbmsId: string): Promise<void>;

    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbms>>;

    abstract get(nameOrId: string): Promise<IDbmsInfo>;

    abstract start(dbmsIds: string[] | List<string>): Promise<List<string>>;

    abstract stop(dbmsIds: string[] | List<string>): Promise<List<string>>;

    abstract info(dbmsIds: string[] | List<string>): Promise<List<IDbmsInfo>>;

    abstract createAccessToken(appName: string, dbmsId: string, authToken: IAuthToken): Promise<string>;

    abstract getDbmsConfig(dbmsId: string): Promise<PropertiesFile>;

    abstract updateConfig(nameOrId: string, properties: Map<string, string>): Promise<boolean>;

    abstract addTags(nameOrId: string, tags: string[]): Promise<IDbmsInfo>;

    abstract removeTags(nameOrId: string, tags: string[]): Promise<IDbmsInfo>;

    runQuery<Res = any>(
        driver: Driver<TapestryJSONResponse<Res>>,
        query: string,
        params: any = {},
        retry = 0,
        meta: IQueryMeta = {},
    ): rxjs.Observable<TapestryJSONResponse<Res>> {
        return driver.query(query, params, meta).pipe(
            rxjsOps.tap((res) => {
                if (res.type === DRIVER_RESULT_TYPE.FAILURE) {
                    throw new DbmsQueryError(`Failed to execute query`, res);
                }
            }),
            rxjsOps.filter(({type}) => type === DRIVER_RESULT_TYPE.RECORD),
            rxjsOps.catchError((e) => {
                if (typeof retry !== 'number' || e instanceof ErrorAbstract) {
                    throw e;
                }

                const message = Str.from(e.message);

                if (!message.includes('ECONNREFUSED') && retry > 2) {
                    throw new ConnectionError('Unable to connect to DBMS', [message]);
                }

                if (retry < MAX_CONNECTION_RETRIES) {
                    const seconds = CONNECTION_RETRY_STEP * retry;

                    return rxjs.from([1]).pipe(
                        rxjsOps.flatMap(() =>
                            rxjs.from(
                                emitHookEvent(HOOK_EVENTS.RUN_QUERY_RETRY, {
                                    query,
                                    params,
                                    retry: retry + 1,
                                }),
                            ),
                        ),
                        rxjsOps.delay(1000 * seconds),
                        rxjsOps.flatMap((update) => this.runQuery(driver, update.query, update.params, update.retry)),
                    );
                }

                throw new ConnectionError('Unable to connect to DBMS', [message]);
            }),
        );
    }

    public async getJSONDriverInstance(dbmsId: string, authToken: IAuthToken): Promise<Driver<TapestryJSONResponse>> {
        const dbmsInfo = (await this.info([dbmsId])).first.getOrElse(() => {
            throw new NotFoundError(`Could not find Dbms ${dbmsId}`);
        });

        if (dbmsInfo.status !== DBMS_STATUS.STARTED) {
            throw new NotAllowedError(`Dbms ${dbmsId} is not started`);
        }

        try {
            // @todo: add support for encrypted connections
            const {hostname, port} = new URL(dbmsInfo.connectionUri);
            const driver = new Driver<TapestryJSONResponse>({
                connectionConfig: {
                    secure: dbmsInfo.secure || undefined,
                    authToken,
                    host: hostname,
                    port: Number(port),
                    unpacker: JsonUnpacker,
                    getResponseHeader: (data): DRIVER_HEADERS => data[0] || DRIVER_HEADERS.FAILURE,
                    getResponseData: (data): any => data[1] || [],
                },
                mapToResult: (headerRecord, type, data) => ({
                    header: headerRecord,
                    type,
                    data,
                }),
            });

            return driver;
        } catch (e) {
            throw new InvalidConfigError('Unable to connect to DBMS');
        }
    }
}
