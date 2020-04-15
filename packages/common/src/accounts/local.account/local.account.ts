import {ensureDir, ensureFile, pathExists, readdir, readFile, rename, stat, writeJson, remove} from 'fs-extra';
import {map, filter as filterArray, reduce, some, includes, omit, merge} from 'lodash';
import decompress from 'decompress';
import {v4 as uuidv4} from 'uuid';
import got from 'got';
import {coerce, satisfies} from 'semver';
import path from 'path';
import {filter, first, flatMap} from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result, Str} from 'tapestry';

import {IDbms, AccountConfigModel} from '../../models';
import {parseNeo4jConfigPort, readPropertiesFile} from '../../utils';
import {PropertiesFile} from '../../properties-file';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    InvalidArgumentError,
    InvalidPathError,
    NotAllowedError,
    NotSupportedError,
} from '../../errors';
import {
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HOST,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONF_FILE_BACKUP,
    NEO4J_CONFIG_KEYS,
    NEO4J_EDITION_ENTERPRISE,
    NEO4J_DISTRIBUTION_REGEX,
    NEO4J_SUPPORTED_VERSION_RANGE,
    NEO4J_DIST_VERSIONS_URL,
    ACCOUNTS_DIR_NAME,
} from '../account.constants';
import {JSON_FILE_EXTENSION} from '../../constants';
import {envPaths} from '../../utils/env-paths';
import {resolveDbms} from './resolve-dbms';
import {AccountAbstract} from '../account.abstract';
import {elevatedNeo4jWindowsCmd, neo4jCmd} from './neo4j-cmd';
import {neo4jAdminCmd} from './neo4j-admin-cmd';

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
    private dbmss: {[id: string]: IDbms} = {};

    private paths = envPaths();

    async init(): Promise<void> {
        await this.discoverDbmss();
    }

    async installDbms(name: string, credentials: string, version: string): Promise<string> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
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

                throw new NotSupportedError('version doesnt exist, so will attempt to download and install');
            }

            const distributionArchiveFileName = `neo4j-${NEO4J_EDITION_ENTERPRISE}-${semver}${
                process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'
            }`;

            return this.installNeo4j(name, semver, credentials, distributionArchiveFileName);
        }

        // version as a URL. This needs more investigation and discussion in upcoming wokr.
        if (this.isValidUrl(version)) {
            throw new NotSupportedError(`fetch and install ${version}`);
        }

        // version as a file path. This needs more discussion in upcoming work.
        if (this.isValidPath(version)) {
            if (!(await pathExists(version))) {
                throw new InvalidPathError('supplied path for version is invalid');
            }

            throw new NotSupportedError(`check and install path ${version}`);
        }

        throw new InvalidArgumentError('unable to install. Cannot resolve version argument');
    }

    async uninstallDbms(nameOrId: string): Promise<void> {
        const {id} = resolveDbms(this.dbmss, nameOrId);
        const status = await neo4jCmd(this.getDbmsRootPath(id), 'status');

        if (!includes(status, 'Neo4j is not running')) {
            throw new NotAllowedError('Cannot uninstall DBMS that is not stopped');
        }

        return this.uninstallNeo4j(id);
    }

    startDbmss(nameOrIds: string[]): Promise<string[]> {
        const ids = nameOrIds.map((nameOrId) => resolveDbms(this.dbmss, nameOrId).id);
        return Promise.all(ids.map((id) => neo4jCmd(this.getDbmsRootPath(id), 'start')));
    }

    stopDbmss(nameOrIds: string[]): Promise<string[]> {
        const ids = nameOrIds.map((nameOrId) => resolveDbms(this.dbmss, nameOrId).id);
        return Promise.all(ids.map((id) => neo4jCmd(this.getDbmsRootPath(id), 'stop')));
    }

    statusDbmss(nameOrIds: string[]): Promise<string[]> {
        const ids = nameOrIds.map((nameOrId) => resolveDbms(this.dbmss, nameOrId).id);

        return Promise.all(ids.map((id) => neo4jCmd(this.getDbmsRootPath(id), 'status')));
    }

    async listDbmss(): Promise<IDbms[]> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.discoverDbmss();
        return Object.values(this.dbmss);
    }

    async createAccessToken(appId: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const dbmsRootPath = this.getDbmsRootPath(resolveDbms(this.dbmss, dbmsNameOrId).id);

        // @todo: switch to using the new class for handling neo4j.conf
        const config = await readPropertiesFile(path.join(dbmsRootPath, NEO4J_CONF_DIR, NEO4J_CONF_FILE));
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

    private getDbmsRootPath(dbmsId: string | null): string {
        const dbmssDir = path.join(this.config.neo4jDataPath || this.paths.data, 'dbmss');

        if (dbmsId) {
            return path.join(dbmssDir, `dbms-${dbmsId}`);
        }

        return dbmssDir;
    }

    private async installNeo4j(
        name: string,
        version: string,
        credentials: string,
        archiveFileName: string,
    ): Promise<string> {
        await ensureDir(path.join(this.paths.cache, 'neo4j'));
        const distributionPath = path.join(this.paths.cache, 'neo4j', archiveFileName);
        const outputDir = this.getDbmsRootPath(null);
        const dbmsId = uuidv4();
        const dbmsIdFilename = `dbms-${dbmsId}`;
        const alreadyExists = await pathExists(path.join(outputDir, dbmsIdFilename));

        if (alreadyExists) {
            throw new DbmsExistsError(`${dbmsIdFilename} already exists`);
        }
        await decompress(distributionPath, outputDir);
        await rename(`${outputDir}/neo4j-${NEO4J_EDITION_ENTERPRISE}-${version}`, `${outputDir}/${dbmsIdFilename}`);
        await this.updateAccountDbmsConfig(dbmsId, {name});

        const config = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        config.set('dbms.security.auth_enabled', true);
        config.set('dbms.memory.heap.initial_size', '512m');
        config.set('dbms.memory.heap.max_size', '1G');
        config.set('dbms.memory.pagecache.size', '512m');
        // https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/#config_dbms.windows_service_name - defaults to 'neo4j'
        config.set(`dbms.windows_service_name`, `neo4j-relate-dbms-${dbmsId}`);

        await config.flush();

        if (process.platform === 'win32') {
            await elevatedNeo4jWindowsCmd(this.getDbmsRootPath(dbmsId), 'install-service');
        }

        await this.ensureStructure(dbmsId, config);

        await config.backupPropertiesFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE_BACKUP),
        );

        await this.setInitialDatabasePassword(dbmsId, credentials);

        // will come back to check the installPluginDependencies situation in future PRs
        return dbmsId;
    }

    private async uninstallNeo4j(dbmsId: string): Promise<void> {
        const dbmsDir = this.getDbmsRootPath(dbmsId);
        const found = await pathExists(dbmsDir);

        if (!found) {
            throw new AmbiguousTargetError(`DBMS ${dbmsId} not found`);
        }

        if (process.platform === 'win32') {
            await elevatedNeo4jWindowsCmd(this.getDbmsRootPath(dbmsId), 'uninstall-service');
        }

        return remove(dbmsDir).then(() => this.deleteAccountDbmsConfig(dbmsId));
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

    private setInitialDatabasePassword(dbmsID: string, credentials: string): Promise<string> {
        return neo4jAdminCmd(this.getDbmsRootPath(dbmsID), 'set-initial-password', credentials);
    }

    private async ensureStructure(dbmsID: string, config: PropertiesFile): Promise<void> {
        const dbmsRoot = this.getDbmsRootPath(dbmsID);
        await ensureDir(path.join(dbmsRoot, await config.get('dbms.directories.run')));
        await ensureDir(path.join(dbmsRoot, await config.get('dbms.directories.logs')));
        await ensureFile(path.join(dbmsRoot, await config.get('dbms.directories.logs'), 'neo4j.log'));
    }

    private async updateAccountDbmsConfig(uuid: string, update: Partial<Omit<IDbms, 'id'>>): Promise<void> {
        const accountConfig = JSON.parse(
            await readFile(
                path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );
        accountConfig.dbmss[uuid] = {
            ...update,
            id: uuid,
        };
        await writeJson(
            path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
            accountConfig,
        );

        this.config = new AccountConfigModel({
            ...this.config,
            dbmss: accountConfig.dbmss,
        });

        await this.discoverDbmss();
    }

    private async deleteAccountDbmsConfig(uuid: string): Promise<void> {
        const accountConfig = JSON.parse(
            await readFile(
                path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );

        accountConfig.dbmss = omit(accountConfig.dbmss, uuid);

        await writeJson(
            path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
            accountConfig,
        );

        this.config = new AccountConfigModel({
            ...this.config,
            dbmss: accountConfig.dbmss,
        });

        await this.discoverDbmss();
    }

    private async discoverDbmss(): Promise<void> {
        this.dbmss = {};

        const fileNames = await readdir(this.getDbmsRootPath(null));
        const configDbmss = this.config.dbmss || {};

        await Promise.all(
            map(fileNames, async (fileName) => {
                const fileStats = await stat(path.join(this.getDbmsRootPath(null), fileName));

                if (fileStats.isDirectory() && fileName.startsWith('dbms-')) {
                    const id = fileName.replace('dbms-', '');
                    const defaultValues = {
                        description: '',
                        name: '',
                    };

                    this.dbmss[id] = merge(defaultValues, configDbmss[id], {
                        id,
                    });
                }
            }),
        );
    }
}
