import {access, constants, readdir, stat} from 'fs-extra';
import {map} from 'lodash';
import {spawn} from 'child_process';
import path from 'path';
import {filter, first, flatMap} from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result, Str} from 'tapestry';

import {AccountAbstract} from './account.abstract';
import {NotFoundError} from '../errors';
import {parseNeo4jConfigPort, readPropertiesFile} from '../utils';
import {
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HOST,
    NEO4J_BIN_DIR,
    NEO4J_BIN_FILE,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONFIG_KEYS,
} from './account.constants';

export class LocalAccount extends AccountAbstract {
    startDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'start')));
    }

    stopDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'stop')));
    }

    statusDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'status')));
    }

    async listDbmss(): Promise<string[]> {
        const files = await readdir(this.getDBMSRootPath(null));
        const dbmss: string[] = [];

        await Promise.all(
            map(files, async (file) => {
                const fileStats = await stat(path.join(this.getDBMSRootPath(null), file));
                if (fileStats.isDirectory()) {
                    dbmss.push(file);
                }
            }),
        );

        return dbmss;
    }

    async createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string> {
        const config = await readPropertiesFile(
            path.join(this.getDBMSRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );
        const host = config.get(NEO4J_CONFIG_KEYS.DEFAULT_LISTEN_ADDRESS) || DEFAULT_NEO4J_HOST;
        const port = parseNeo4jConfigPort(config.get(NEO4J_CONFIG_KEYS.BOLT_LISTEN_ADDRESS) || DEFAULT_NEO4J_BOLT_PORT);
        const driver = new Driver<Result>({
            connectionConfig: {
                authToken,
                host,
                port,
            },
        });

        return driver
            .query('CALL jwt.security.requestAccess($appId)', {appId})
            .pipe(
                filter(({type}) => type === DRIVER_RESULT_TYPE.RECORD),
                first(),
                flatMap((rec) => rec.getFieldData('token').getOrElse(Str.EMPTY)),
            )
            .toPromise()
            .finally(() => driver.shutDown().toPromise());
    }

    private getDBMSRootPath(dbmsId: string | null): string {
        const dbmssDir = path.join(this.config.neo4jDataPath, 'dbmss');

        if (dbmsId) {
            return path.join(dbmssDir, dbmsId);
        }

        return dbmssDir;
    }

    private neo4j(dbmsID: string, command: string): Promise<string> {
        const neo4jBinPath = path.join(this.getDBMSRootPath(dbmsID), NEO4J_BIN_DIR, NEO4J_BIN_FILE);

        return new Promise((resolve, reject) => {
            access(neo4jBinPath, constants.X_OK, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    reject(new NotFoundError(`DBMS "${dbmsID}" not found`));
                    return;
                }
                const data: string[] = [];
                const collect = (chunk: Buffer) => {
                    data.push(chunk.toString());
                };

                const neo4jCommand = spawn(neo4jBinPath, [command]);
                neo4jCommand.stderr.on('data', collect);
                neo4jCommand.stderr.on('error', reject);
                neo4jCommand.stderr.on('close', () => resolve(data.join('')));
                neo4jCommand.stderr.on('end', () => resolve(data.join('')));

                neo4jCommand.stdout.on('data', collect);
                neo4jCommand.stdout.on('error', reject);
                neo4jCommand.stdout.on('close', () => resolve(data.join('')));
                neo4jCommand.stdout.on('end', () => resolve(data.join('')));
            });
        });
    }
}
