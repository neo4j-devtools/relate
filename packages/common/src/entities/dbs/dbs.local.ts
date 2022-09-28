import {List} from '@relate/types';
import fse, {ReadStream} from 'fs-extra';
import path from 'path';
import semver from 'semver';

import {IDb4, IDb5} from '../../models';
import {neo4jAdminCmd} from '../../utils/dbmss';
import {CypherParameterError} from '../../errors';
import {LocalEnvironment, NEO4J_VERSION_5X} from '../environments';
import {NEO4J_DB_NAME_REGEX} from './dbs.constants';
import {dbReadQuery, dbWriteQuery} from '../../utils/dbmss/system-db-query';
import {cypherShellCmd} from '../../utils/dbmss/cypher-shell';
import {DbsAbstract} from './dbs.abstract';

export class LocalDbs extends DbsAbstract<LocalEnvironment> {
    async create(dbmsNameOrId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
        if (!dbName.match(NEO4J_DB_NAME_REGEX)) {
            throw new CypherParameterError(`Cannot safely pass "${dbName}" as a Cypher parameter`);
        }

        await dbWriteQuery(
            this.environment,
            {
                database: 'system',
                accessToken,
                dbmsNameOrId,
                dbmsUser,
            },
            `CREATE DATABASE ${`\`${dbName}\``}`,
        );
    }

    async drop(dbmsNameOrId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
        if (!dbName.match(NEO4J_DB_NAME_REGEX)) {
            throw new CypherParameterError(`Cannot safely pass "${dbName}" as a Cypher parameter`);
        }

        await dbWriteQuery(
            this.environment,
            {
                database: 'system',
                accessToken,
                dbmsNameOrId,
                dbmsUser,
            },
            `DROP DATABASE ${`\`${dbName}\``}`,
        );
    }

    async list(dbmsNameOrId: string, dbmsUser: string, accessToken: string): Promise<List<IDb4 | IDb5>> {
        const dbms = await this.environment.dbmss.get(dbmsNameOrId);

        const dbs = await dbReadQuery(
            this.environment,
            {
                database: 'system',
                accessToken,
                dbmsNameOrId,
                dbmsUser,
            },
            `SHOW DATABASES`,
        );

        return dbs.mapEach((db) => {
            if (dbms.version && semver.satisfies(dbms.version, NEO4J_VERSION_5X, {includePrerelease: true})) {
                return {
                    name: db.get('name'),
                    type: db.get('type'),
                    aliases: db.get('aliases'),
                    access: db.get('access'),
                    address: db.get('address'),
                    role: db.get('role'),
                    writer: db.get('writer'),
                    requestedStatus: db.get('requestedStatus'),
                    currentStatus: db.get('currentStatus'),
                    statusMessage: db.get('statusMessage'),
                    default: Boolean(db.get('default')),
                    home: Boolean(db.get('home')),
                    constituents: db.get('constituents'),
                };
            }

            return {
                name: db.get('name'),
                address: db.get('address'),
                role: db.get('role'),
                currentStatus: db.get('currentStatus'),
                requestedStatus: db.get('requestedStatus'),
                error: db.get('error'),
                default: Boolean(db.get('default')),
                home: Boolean(db.get('home')),
            };
        });
    }

    async dump(nameOrId: string, database: string, to: string, javaPath?: string): Promise<string> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        const params =
            dbms.version && semver.satisfies(dbms.version, NEO4J_VERSION_5X, {includePrerelease: true})
                ? ['database', 'dump', `--to-path=${to}`, database]
                : ['dump', `--database=${database}`, `--to=${to}`];
        const result = await neo4jAdminCmd(await this.resolveDbmsRootPath(dbms.id), params, '', javaPath);
        return result;
    }

    async load(nameOrId: string, database: string, from: string, force?: boolean, javaPath?: string): Promise<string> {
        const dbms = await this.environment.dbmss.get(nameOrId);
        const params =
            dbms.version && semver.satisfies(dbms.version, NEO4J_VERSION_5X, {includePrerelease: true})
                ? ['database', 'load', `--from-path=${from}`, database, ...(force ? ['--overwrite-destination'] : [])]
                : ['load', `--database=${database}`, `--from=${from}`, ...(force ? ['--force'] : [])];
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
