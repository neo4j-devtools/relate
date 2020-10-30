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
    async create(nameOrId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        if (!dbName.match(NEO4J_DB_NAME_REGEX)) {
            throw new CypherParameterError(`Cannot safely pass "${dbName}" as a Cypher parameter`);
        }

        await systemDbQuery(
            {
                accessToken,
                dbmsId: dbms.id,
                dbmsUser,
                environment: this.environment,
            },
            `CREATE DATABASE ${dbName}`,
        );
    }

    async drop(nameOrId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        if (!dbName.match(NEO4J_DB_NAME_REGEX)) {
            throw new CypherParameterError(`Cannot safely pass "${dbName}" as a Cypher parameter`);
        }

        await systemDbQuery(
            {
                accessToken,
                dbmsId: dbms.id,
                dbmsUser,
                environment: this.environment,
            },
            `DROP DATABASE ${dbName}`,
        );
    }

    async list(nameOrId: string, dbmsUser: string, accessToken: string): Promise<List<IDb>> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        const dbs = await systemDbQuery(
            {
                accessToken,
                dbmsId: dbms.id,
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

    async dump(nameOrId: string, database: string, to: string, javaPath?: string): Promise<string> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        const params = ['dump', `--database=${database}`, `--to=${to}`];
        const result = await neo4jAdminCmd(await this.resolveDbmsRootPath(dbms.id), params, '', javaPath);
        return result;
    }

    async load(nameOrId: string, database: string, from: string, force?: boolean, javaPath?: string): Promise<string> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        const params = ['load', `--database=${database}`, `--from=${from}`, ...(force ? ['--force'] : [])];
        const result = await neo4jAdminCmd(await this.resolveDbmsRootPath(dbms.id), params, '', javaPath);
        return result;
    }

    async exec(
        nameOrId: string,
        from: string | ReadStream,
        args: {
            database: string;
            user: string;
            accessToken: string;
        },
    ): Promise<string> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        const params = [
            '--format=plain',
            `--address=${dbms.connectionUri}`,
            ...Object.entries(args).map(([key, val]) => {
                return key === 'accessToken' ? `--password=${val}` : `--${key}=${val}`;
            }),
        ];
        const result = await cypherShellCmd(await this.resolveDbmsRootPath(dbms.id), params, from);

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
