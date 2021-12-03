import {List} from '@relate/types';
import {driver, Driver, QueryResult} from 'neo4j-driver-lite';

import {
    DbmsManifestModel,
    IAuthToken,
    IQueryTarget,
    IDbms,
    IDbmsInfo,
    IDbmsUpgradeOptions,
    IDbmsVersion,
} from '../../models';

import {EnvironmentAbstract, NEO4J_EDITION} from '../environments';
import {PropertiesFile} from '../../system/files';
import {InvalidConfigError, NotAllowedError, NotFoundError} from '../../errors';
import {DBMS_SERVER_STATUS, DBMS_STATUS} from '../../constants';
import {IRelateFilter} from '../../utils/generic';
import {ManifestAbstract} from '../manifest';
import {waitForDbmsToBeOnline} from '../../utils/dbmss';

export abstract class DbmssAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    public dbmss: {[id: string]: IDbms} = {};

    abstract readonly manifest: ManifestAbstract<Env, IDbmsInfo, DbmsManifestModel>;

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
     * @param   installPath     A user selected path to install to, if not provided the default location will be used.
     */
    abstract install(
        name: string,
        version: string,
        edition?: NEO4J_EDITION,
        credentials?: string,
        overrideCache?: boolean,
        limited?: boolean,
        installPath?: string,
    ): Promise<IDbmsInfo>;

    abstract upgrade(dbmsId: string, version: string, options?: IDbmsUpgradeOptions): Promise<IDbmsInfo>;

    /**
     * Links an existing DBMS to relate
     * @param   externalPath    Path to DBMS root
     * @param   name            Name of DBMS
     */
    abstract link(externalPath: string, name: string): Promise<IDbmsInfo>;

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
    abstract stop(dbmsIds: Array<string | IQueryTarget> | List<string | IQueryTarget>): Promise<List<string>>;

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
     * @hidden
     */
    runReadQuery(
        neo4jDriver: Driver,
        query: string,
        params: any = {},
        sessionParams: {
            database?: string;
        } = {},
    ): Promise<QueryResult> {
        const session = neo4jDriver.session(sessionParams);

        const readTransactionPromise = session.readTransaction((txc) => {
            const result = txc.run(query, params);

            return result;
        });

        return readTransactionPromise;
    }

    /**
     * @hidden
     */
    runWriteQuery(
        neo4jDriver: Driver,
        query: string,
        params: any = {},
        sessionParams: {
            database?: string;
        } = {},
    ): Promise<QueryResult> {
        const session = neo4jDriver.session(sessionParams);

        const writeTransactionPromise = session.writeTransaction((txc) => {
            const result = txc.run(query, params);

            return result;
        });

        return writeTransactionPromise;
    }

    /**
     * @hidden
     */
    public async getDriverInstance(dbmsId: string, authToken: IAuthToken): Promise<Driver> {
        const dbmsInfo: IDbmsInfo = (await this.info([dbmsId], true)).first.getOrElse(() => {
            throw new NotFoundError(`Could not find Dbms ${dbmsId}`);
        });

        if (dbmsInfo.status !== DBMS_STATUS.STARTED) {
            throw new NotAllowedError(`Dbms ${dbmsId} is not started`);
        }

        if (dbmsInfo.serverStatus !== DBMS_SERVER_STATUS.ONLINE) {
            await waitForDbmsToBeOnline({
                ...dbmsInfo,
                config: await this.getDbmsConfig(dbmsId),
            });
        }

        try {
            const neo4jDriver = driver(dbmsInfo.connectionUri, authToken, {
                encrypted: Boolean(dbmsInfo.secure),
            });

            return neo4jDriver;
        } catch (e) {
            throw new InvalidConfigError('Unable to connect to DBMS');
        }
    }
}
