import {access, constants, ensureDir, ensureFile, readdir, readFile, rename, writeJson} from 'fs-extra';
import {filter as filterArray, reduce, some} from 'lodash';
import decompress from 'decompress';
import {v4 as uuidv4} from 'uuid';
import got from 'got';
import {coerce, satisfies} from 'semver';
import {spawn} from 'child_process';
import path from 'path';
import {filter, first, flatMap} from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result, Str} from 'tapestry';

import {AccountAbstract} from './account.abstract';
import {
    DbmsExistsError,
    InvalidArgumentError,
    InvalidPathError,
    NotFoundError,
    NotSupportedError,
    UndefinedError,
} from '../errors';
import {parseNeo4jConfigPort, readPropertiesFile} from '../utils';
import {
    ACCOUNTS_DIR_NAME,
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HOST,
    NEO4J_BIN_DIR,
    NEO4J_BIN_FILE,
    NEO4J_ADMIN_BIN_FILE,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONFIG_KEYS,
    NEO4J_EDITION_ENTERPRISE,
    NEO4J,
    NEO4J_DISTRIBUTION_REGEX,
    NEO4J_SUPPORTED_VERSION_RANGE,
    NEO4J_DIST_VERSIONS_URL,
} from './account.constants';
import {JSON_FILE_EXTENSION} from '../constants';
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
    async installDbms(name: string, credentials: string, version: string): Promise<string> {
        if (!version) {
            return Promise.reject(new UndefinedError('version undefined'));
        }

        // version as semver e.g. '4.0.0'
        if (coerce(version) && coerce(version)!.version) {
            const {version: semver} = coerce(version)!;
            if (!satisfies(semver, NEO4J_SUPPORTED_VERSION_RANGE)) {
                return Promise.reject(new NotSupportedError(`version not in range ${NEO4J_SUPPORTED_VERSION_RANGE}`));
            }
            const neo4jDistributions = await this.getDownloadedNeo4jDistributions();
            const neo4jDistributionExists = some(neo4jDistributions, (neo4jDistribution) => {
                return neo4jDistribution.edition === NEO4J_EDITION_ENTERPRISE && neo4jDistribution.version === semver;
            });

            if (!neo4jDistributionExists) {
                // to complete in a future PR
                await this.fetchNeo4jVersions();
                return Promise.resolve('version doesnt exist, so will attempt to download and install');
            }

            const distributionArchiveFileName = `${NEO4J}-${NEO4J_EDITION_ENTERPRISE}-${semver}${
                process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'
            }`;
            await this.installNeo4j(name, semver, credentials, distributionArchiveFileName);
            return Promise.resolve('installed');
        }

        // version as a URL. This needs more investigation and discussion in upcoming wokr.
        if (this.isValidUrl(version)) {
            return Promise.resolve(`fetch and install ${version}`);
        }

        // version as a file path. This needs more discussion in upcoming work.
        if (this.isValidPath(version)) {
            if (!(await this.pathExists(version))) {
                return Promise.reject(new InvalidPathError('supplied path for version is invalid'));
            }
            return Promise.resolve(`check and install path ${version}`);
        }

        return Promise.reject(new InvalidArgumentError('unable to install. Cannot resolve version argument'));
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

    private async installNeo4j(
        name: string,
        version: string,
        credentials: string,
        archiveFileName: string,
    ): Promise<void> {
        await ensureDir(path.join(this.paths.cache, NEO4J));
        const distributionPath = path.join(this.paths.cache, NEO4J, archiveFileName);
        const outputDir = this.getDBMSRootPath(null);
        const id = uuidv4();
        const dbmsId = `dbms-${id}`;

        if (!this.pathExists(path.join(outputDir, dbmsId))) {
            return Promise.reject(new DbmsExistsError(`${dbmsId} already exists`));
        }
        await decompress(distributionPath, outputDir);
        await rename(`${outputDir}/${NEO4J}-${NEO4J_EDITION_ENTERPRISE}-${version}`, `${outputDir}/${dbmsId}`);
        await this.updateAccountDbmsConfig(id, name);

        // neo4j config
        const config = await readPropertiesFile(
            path.join(this.getDBMSRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        await this.ensureStructure(dbmsId, config);

        // @TODO set config (in upcoming PR)
        // not doing UDC as it "dropped in 4.0. it may return"
        // conf.set('dbms.security.auth_enabled', 'true');
        // conf.set('dbms.memory.heap.initial_size', '512m');
        // conf.set('dbms.memory.heap.max_size', '1G');
        // conf.set('dbms.memory.pagecache.size', '512m');

        // Save config
        // await backupConfig(id, version);

        // check auth enabled from config and set password
        // 'dbms.security.auth_enabled') === 'true'
        await this.setInitialDatabasePassword(dbmsId, credentials);

        // will come back to check the installPluginDependencies situation in future PRs
        return Promise.resolve();
    }

    private async fetchNeo4jVersions(): Promise<INeo4jVersion[] | []> {
        await got(NEO4J_DIST_VERSIONS_URL);
        return [];
    }

    private async getDownloadedNeo4jDistributions(): Promise<INeo4jDistribution[] | []> {
        await ensureDir(path.join(this.paths.cache, 'neo4j'));
        const fileNames = await readdir(path.join(this.paths.cache, 'neo4j'));
        const fileNamesFilter = filterArray(fileNames, (fileName) =>
            fileName.endsWith(process.platform === 'win32' ? '.zip' : '.tar.gz'),
        );
        return reduce(
            fileNamesFilter,
            (acc: INeo4jDistribution[], fileName: string) => {
                const match = fileName.match(NEO4J_DISTRIBUTION_REGEX);
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

    private isValidPath(stringVal: string): boolean {
        if (stringVal.split(path.sep).length > 1) {
            return true;
        }
        return false;
    }

    private async pathExists(pathVal: string): Promise<boolean> {
        try {
            await access(pathVal);
            return true;
        } catch (_) {
            return false;
        }
    }

    private setInitialDatabasePassword(dbmsID: string, credentials: string): Promise<string> {
        const neo4jAdminBinPath = path.join(this.getDBMSRootPath(dbmsID), NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE);

        return new Promise((resolve, reject) => {
            access(neo4jAdminBinPath, constants.X_OK, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    reject(new NotFoundError(`DBMS "${dbmsID}" not found`));
                    return;
                }
                const data: string[] = [];
                const collect = (chunk: Buffer) => {
                    data.push(chunk.toString());
                };

                const neo4jAdminCommand = spawn(neo4jAdminBinPath, [
                    'set-initial-password',
                    process.platform === 'win32' ? `"${credentials}"` : credentials,
                ]);
                neo4jAdminCommand.stderr.on('data', collect);
                neo4jAdminCommand.stderr.on('error', reject);
                neo4jAdminCommand.stderr.on('close', () => resolve(data.join('')));
                neo4jAdminCommand.stderr.on('end', () => resolve(data.join('')));

                neo4jAdminCommand.stdout.on('data', collect);
                neo4jAdminCommand.stdout.on('error', reject);
                neo4jAdminCommand.stdout.on('close', () => resolve(data.join('')));
                neo4jAdminCommand.stdout.on('end', () => resolve(data.join('')));
            });
        });
    }

    private async ensureStructure(dbmsID: string, config: any): Promise<void> {
        // Currently reading via commented lines, whereas Config on Desktop v1 will have defaults set...
        await ensureDir(path.join(this.getDBMSRootPath(dbmsID), config.get('#dbms.directories.run')));
        await ensureDir(path.join(this.getDBMSRootPath(dbmsID), config.get('#dbms.directories.logs')));
        await ensureFile(path.join(this.getDBMSRootPath(dbmsID), config.get('#dbms.directories.logs'), 'neo4j.log'));
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

    private async updateAccountDbmsConfig(uuid: string, name: string): Promise<void> {
        const accountConfig = JSON.parse(
            await readFile(
                path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );
        accountConfig.dbmss[uuid] = {
            uuid,
            name,
            description: '',
        };
        await writeJson(
            path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
            accountConfig,
        );
    }
}
