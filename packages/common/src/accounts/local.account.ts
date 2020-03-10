/* eslint-disable no-console */
import {access, constants, ensureDir, ensureFile, readdir, rename} from 'fs-extra';
import {filter as filterArray, reduce, some} from 'lodash';
import decompress from 'decompress';
import got from 'got';
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
import {envPaths} from '../utils/env-paths';

interface INeo4jDistribution {
    version: string;
    edition: string;
}

interface INeo4jVersion {
    version: string;
    releaseNotes: string;
    dist?: INeo4jDists;
    limited: boolean;
    latest: boolean;
}

interface INeo4jDists {
    mac: string;
    win: string;
    linux: string;
}

export class LocalAccount extends AccountAbstract {
    async createDbms(name: string, password: string, source?: string): Promise<string> {
        // Assuming source arg will be version in the form '4.0.1', or a URL (or path?), or undefined
        console.log(name, source, password);

        // !Source
        if (!source) {
            // @TODO check downloaded versions and show a list? prompt user? download latest version?
        }

        // Source
        if (source) {
            if (this.isValidUrl(source)) {
                // @TODO need to verify/download and check whats downloaded

                console.log(`fetch and install ${source}`);
            } else if (source && /^(\d.){2}\d$/.test(source)) {
                const edition = 'enterprise';
                const version = source;

                console.log('++++ getDownloadedNeo4jDistributions()', await this.getDownloadedNeo4jDistributions());
                const neo4jDistributions = await this.getDownloadedNeo4jDistributions();
                const neo4jDistributionExists = some(neo4jDistributions, (neo4jDistribution) => {
                    return neo4jDistribution.edition === edition && neo4jDistribution.version === version;
                });

                console.log('++++ neo4jDistributionExists', neo4jDistributionExists);
                if (neo4jDistributionExists) {
                    await this.installNeo4j(name, version);
                } else {
                    await this.fetchNeo4jVersions();
                }
            }
        }
        return Promise.resolve('done');
    }

    startDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'start')));
    }

    stopDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'stop')));
    }

    statusDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'status')));
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

    protected readonly paths = envPaths();

    /* eslint-disable consistent-return */
    private async installNeo4j(name: string, version: string): Promise<void> {
        // will move to constants
        const edition = 'enterprise';
        const distributionArchiveFileName = `neo4j-${edition}-${version}${
            process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'
        }`;
        const distributionPath = path.join(this.paths.cache, 'neo4j', distributionArchiveFileName);
        const outputDir = this.getDBMSRootPath(null);
        console.log('+++distributionPath', distributionPath);
        console.log('+++outputDir', outputDir);
        try {
            await access(path.join(outputDir, name));
            console.log(`${outputDir}/${name} already exists!`);
            return Promise.reject(new Error('fail'));
        } catch (_) {
            await decompress(distributionPath, outputDir);
            await rename(`${outputDir}/neo4j-${edition}-${version}`, `${outputDir}/${name}`);
            const config = await readPropertiesFile(
                path.join(this.getDBMSRootPath(name), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
            );

            console.log('+++conf', config);
            this.ensureStructure(name, config);
            // need to set config here, make a config copy, initial password and install plugin dependencies...
        }
    }

    private async fetchNeo4jVersions(): Promise<INeo4jVersion[] | []> {
        const response = await got('http://dist.neo4j.org/versions/v1/neo4j-versions.json');
        console.log('+++response', response.body);
        return [];
    }

    private async getDownloadedNeo4jDistributions(): Promise<INeo4jDistribution[] | []> {
        const fileNames = await readdir(path.join(this.paths.cache, 'neo4j'));
        const fileNamesFilter = filterArray(fileNames, (fileName) =>
            fileName.endsWith(process.platform === 'win32' ? '.zip' : '.tar.gz'),
        );
        return reduce(
            fileNamesFilter,
            (acc: INeo4jDistribution[], fileName: string) => {
                const match = fileName.match(/^neo4j-([\D]+)-([\S.-]+)-.*/);
                if (match) {
                    const [, edition, version] = match;
                    acc.push({
                        edition,
                        version,
                    });
                    return acc;
                }
                return acc;
            },
            [],
        );
    }

    private isValidUrl(stringVal: string): boolean {
        try {
            /* eslint-disable no-new */
            new URL(stringVal);
            return true;
        } catch (_) {
            return false;
        }
    }

    private async ensureStructure(name: string, config: any): Promise<void> {
        // Currently reading via commented lines, whereas Config on Desktop v1 will have defaults set...
        await ensureDir(path.join(this.getDBMSRootPath(name), config.get('#dbms.directories.run')));
        await ensureDir(path.join(this.getDBMSRootPath(name), config.get('#dbms.directories.logs')));
        await ensureFile(path.join(this.getDBMSRootPath(name), config.get('#dbms.directories.logs'), 'neo4j.log'));
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
