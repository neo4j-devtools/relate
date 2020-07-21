import {List} from '@relate/types';
import fse, {ReadStream} from 'fs-extra';
import path from 'path';

import {IDb} from '../../models';
import {neo4jAdminCmd} from '../../utils/dbmss';
import {CypherParameterError} from '../../errors';
import {LocalEnvironment} from '../environments';
import {NEO4J_DB_NAME_REGEX} from './dbs.constants';
import {systemDbQuery} from '../../utils/dbmss/system-db-query';
import {cypherShellCmd} from '../../utils/dbmss/cypher-shell';
import {DbsAbstract} from './dbs.abstract';

export class LocalDbs extends DbsAbstract<LocalEnvironment> {
    async create(dbmsId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
        if (!dbName.match(NEO4J_DB_NAME_REGEX)) {
            throw new CypherParameterError(`Cannot safely pass "${dbName}" as a Cypher parameter`);
        }

        await systemDbQuery(
            {
                accessToken,
                dbmsId,
                dbmsUser,
                environment: this.environment,
            },
            `CREATE DATABASE ${dbName}`,
        );
    }

    async drop(dbmsId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
        if (!dbName.match(NEO4J_DB_NAME_REGEX)) {
            throw new CypherParameterError(`Cannot safely pass "${dbName}" as a Cypher parameter`);
        }

        await systemDbQuery(
            {
                accessToken,
                dbmsId,
                dbmsUser,
                environment: this.environment,
            },
            `DROP DATABASE ${dbName}`,
        );
    }

    async list(dbmsId: string, dbmsUser: string, accessToken: string): Promise<List<IDb>> {
        const dbs = await systemDbQuery(
            {
                accessToken,
                dbmsId,
                dbmsUser,
                environment: this.environment,
            },
            `SHOW DATABASES`,
        );

        return dbs.mapEach(({data}) => {
            return {
                name: data[0],
                role: data[2],
                requestedStatus: data[3],
                currentStatus: data[4],
                error: data[5],
                default: Boolean(data[6]),
            };
        });
    }

    async dump(dbmsId: string, database: string, to: string, javaPath?: string): Promise<string> {
        const params = ['dump', `--database=${database}`, `--to=${to}`];
        const result = await neo4jAdminCmd(await this.resolveDbmsRootPath(dbmsId), params, '', javaPath);
        return result;
    }

    async load(dbmsId: string, database: string, from: string, force?: boolean, javaPath?: string): Promise<string> {
        const params = ['load', `--database=${database}`, `--from=${from}`, ...(force ? ['--force'] : [])];
        const result = await neo4jAdminCmd(await this.resolveDbmsRootPath(dbmsId), params, '', javaPath);
        return result;
    }

    async exec(
        dbmsId: string,
        from: string | ReadStream,
        args: {
            database: string;
            user: string;
            accessToken: string;
        },
    ): Promise<string> {
        const dbms = await this.environment.dbmss.get(dbmsId);
        const params = [
            '--format=plain',
            `--address=${dbms.connectionUri}`,
            ...Object.entries(args).map(([key, val]) => {
                return key === 'accessToken' ? `--password=${val}` : `--${key}=${val}`;
            }),
        ];
        const result = await cypherShellCmd(await this.resolveDbmsRootPath(dbmsId), params, from);

        return result;
    }

    private async resolveDbmsRootPath(dbmsId: string): Promise<string> {
        // Checks if the supplied string is a DBMS root path
        if (await fse.pathExists(path.join(dbmsId, 'bin', 'neo4j'))) {
            return dbmsId;
        }

        return this.environment.dbmss.getDbmsRootPath(dbmsId);
    }
}
