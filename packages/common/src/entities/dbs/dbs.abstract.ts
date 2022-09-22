import {List} from '@relate/types';
import {ReadStream} from 'fs-extra';

import {IDb4, IDb5} from '../../models';

import {EnvironmentAbstract} from '../environments';

export abstract class DbsAbstract<Env extends EnvironmentAbstract> {
    /**
     * @hidden
     */
    constructor(protected readonly environment: Env) {}

    /**
     * Creates a new Database
     * @param   dbmsId
     * @param   user            DBMS user
     * @param   dbName          Database name
     * @param   accessToken     DBMS access token
     */
    abstract create(dbmsId: string, user: string, dbName: string, accessToken: string): Promise<void>;

    /**
     * Drops a Database
     * @param   dbmsId
     * @param   user            DBMS user
     * @param   dbName          Database name
     * @param   accessToken     DBMS access token
     */
    abstract drop(dbmsId: string, user: string, dbName: string, accessToken: string): Promise<void>;

    /**
     * Lists all databases
     * @param   dbmsId
     * @param   user            DBMS user
     * @param   accessToken     DBMS access token
     */
    abstract list(dbmsId: string, user: string, accessToken: string): Promise<List<IDb4 | IDb5>>;

    /**
     * Dumps a databese contents
     * @param   dbmsId
     * @param   database        Database to dump
     * @param   user            DBMS user
     * @param   accessToken     DBMS access token
     */
    abstract dump(dbmsId: string, database: string, to: string, javaPath?: string): Promise<string>;

    /**
     * Loads a database dump
     * @param   dbmsId
     * @param   database        Database to load contents into
     * @param   force
     * @param   javaPath
     */
    abstract load(dbmsId: string, database: string, from: string, force?: boolean, javaPath?: string): Promise<string>;

    /**
     * Executes cypher against a given dbms
     * @param   dbmsId
     * @param   from
     * @param   args
     */
    abstract exec(
        dbmsId: string,
        from: string | ReadStream,
        args: {database: string; user: string; accessToken: string},
    ): Promise<string>;
}
