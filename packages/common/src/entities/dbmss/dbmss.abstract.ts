import {List, Str} from '@relate/types';
import {Driver, DRIVER_HEADERS, DRIVER_RESULT_TYPE, IAuthToken, JsonUnpacker, IQueryMeta} from '@huboneo/tapestry';
import * as rxjs from 'rxjs';
import * as rxjsOps from 'rxjs/operators';

import {IDbms, IDbmsManifest, IDbmsInfo, IDbmsVersion, DbmsManifestModel} from '../../models';

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

/**
 * @hidden
 */
export type TapestryJSONResponse<Res = any> = {
    header: {fields: string[]};
    type: DRIVER_RESULT_TYPE;
    data: Res;
};

export abstract class DbmssAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    public dbmss: {[id: string]: IDbms} = {};

    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * List all available DBMS versions to install
     * @param   limited     Include limited versions
     * @param   filters     Filters to apply
     */
    abstract versions(limited?: boolean, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbmsVersion>>;

    /**
     * Installs new DBMS
     * @param   name            DBMS name
     * @param   credentials     Initial password to set
     * @param   version         neo4j version
     * @param   edition         neo4j edition
     * @param   overrideCache   Download distribution even if it's present in cache
     * @param   limited         Is limited version
     */
    abstract install(
        name: string,
        version: string,
        edition?: NEO4J_EDITION,
        credentials?: string,
        overrideCache?: boolean,
        limited?: boolean,
    ): Promise<IDbmsInfo>;

    abstract upgrade(
        dbmsId: string,
        version: string,
        migrate?: boolean,
        backup?: boolean,
        noCache?: boolean,
    ): Promise<IDbmsInfo>;

    /**
     * Links an existing DBMS to relate
     * @param   name        Name of DBMS
     * @param   rootPath    Path to DBMS root
     */
    abstract link(name: string, rootPath: string): Promise<IDbmsInfo>;

    /**
     * Clone a DBMS
     * @param   id
     * @param   name
     */
    abstract clone(id: string, name: string): Promise<IDbmsInfo>;

    /**
     * Uninstall a DBMS
     * @param dbmsId
     */
    abstract uninstall(dbmsId: string): Promise<IDbmsInfo>;

    /**
     * List all DBMS
     * @param   filters     Filters to apply
     */
    abstract list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbms>>;

    /**
     * Get a DBMS by name or id
     * @param   nameOrId
     */
    abstract get(nameOrId: string): Promise<IDbmsInfo>;

    /**
     * Start one or more DBMSs
     * @param   dbmsIds
     */
    abstract start(dbmsIds: string[] | List<string>): Promise<List<string>>;

    /**
     * Stop one or more DBMSs
     * @param   dbmsIds
     */
    abstract stop(dbmsIds: string[] | List<string>): Promise<List<string>>;

    /**
     * Get info for one or more DBMSs
     * @param   dbmsIds
     */
    abstract info(dbmsIds: string[] | List<string>, onlineCheck?: boolean): Promise<List<IDbmsInfo>>;

    /**
     * Creates an access token for a given app, DBMS, and DBMS credentials
     * @param   appName
     * @param   dbmsId
     * @param   authToken
     */
    abstract createAccessToken(appName: string, dbmsId: string, authToken: IAuthToken): Promise<string>;

    /**
     * Get dbms configuration (neo4j.conf)
     * @param   dbmsId
     */
    abstract getDbmsConfig(dbmsId: string): Promise<PropertiesFile>;

    /**
     * Set dbms configuration properties (neo4j.conf)
     * @param   dbmsId
     */
    abstract updateConfig(nameOrId: string, properties: Map<string, string>): Promise<boolean>;

    /**
     * Add tags to a DBMS
     * @param   nameOrId
     * @param   tags
     */
    abstract addTags(nameOrId: string, tags: string[]): Promise<IDbmsInfo>;

    /**
     * Remove tags from a DBMS
     * @param   nameOrId
     * @param   tags
     */
    abstract removeTags(nameOrId: string, tags: string[]): Promise<IDbmsInfo>;

    /**
     * Updates a DBMS manifest
     * @param   dbmsId
     * @param   update
     */
    abstract updateDbmsManifest(dbmsId: string, update: Partial<Omit<IDbmsManifest, 'id'>>): Promise<void>;

    /**
     * Gets a DBMS manifest
     * @param   dbmsId
     */
    abstract getDbmsManifest(dbmsId: string): Promise<DbmsManifestModel>;

    /**
     * @hidden
     */
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

    /**
     * @hidden
     */
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
