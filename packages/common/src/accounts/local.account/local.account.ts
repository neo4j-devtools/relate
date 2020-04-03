import {ensureDir, ensureFile, pathExists, readdir, readFile, rename, stat, writeJson} from 'fs-extra';
import {map, filter as filterArray, reduce, some} from 'lodash';
import decompress from 'decompress';
import {v4 as uuidv4} from 'uuid';
import got from 'got';
import {coerce, satisfies} from 'semver';
import path from 'path';
import {filter, first, flatMap} from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result, Str} from 'tapestry';

import {IDbms} from '../../models/account-config.model';
import {parseNeo4jConfigPort, readPropertiesFile} from '../../utils';
import {DbmsExistsError, InvalidArgumentError, InvalidPathError, NotSupportedError, UndefinedError} from '../../errors';
import {
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HOST,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
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
import {neo4jCmd} from './neo4j-cmd';
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

            const distributionArchiveFileName = `neo4j-${NEO4J_EDITION_ENTERPRISE}-${semver}${
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
            if (!(await pathExists(version))) {
                return Promise.reject(new InvalidPathError('supplied path for version is invalid'));
            }
            return Promise.resolve(`check and install path ${version}`);
        }

        return Promise.reject(new InvalidArgumentError('unable to install. Cannot resolve version argument'));
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
        const dbmssDir = path.join(this.config.neo4jDataPath, 'dbmss');

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
    ): Promise<void> {
        await ensureDir(path.join(this.paths.cache, 'neo4j'));
        const distributionPath = path.join(this.paths.cache, 'neo4j', archiveFileName);
        const outputDir = this.getDbmsRootPath(null);
        const dbmsId = uuidv4();
        const dbmsIdFilename = `dbms-${dbmsId}`;

        if (await pathExists(path.join(outputDir, dbmsIdFilename))) {
            return Promise.reject(new DbmsExistsError(`${dbmsIdFilename} already exists`));
        }
        await decompress(distributionPath, outputDir);
        await rename(`${outputDir}/neo4j-${NEO4J_EDITION_ENTERPRISE}-${version}`, `${outputDir}/${dbmsIdFilename}`);
        await this.updateAccountDbmsConfig(dbmsId, name);

        // neo4j config
        const config = await readPropertiesFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        await this.ensureStructure(dbmsId, config);

        // @TODO set config (in upcoming PR)
        // not doing UDC as it "dropped in 4.0. it may return"
        // conf.set('dbms.security.auth_enabled', 'true');
        // conf.set('dbms.memory.heap.initial_size', '512m');
        // conf.set('dbms.memory.heap.max_size', '1G');
        // conf.set('dbms.memory.pagecache.size', '512m');

        // Save config
        // await backupConfig(dbmsId, version);

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

    private setInitialDatabasePassword(dbmsID: string, credentials: string): Promise<string> {
        return neo4jAdminCmd(this.getDbmsRootPath(dbmsID), 'set-initial-password', credentials);
    }

    private async ensureStructure(dbmsID: string, config: any): Promise<void> {
        const dbmsRoot = this.getDbmsRootPath(dbmsID);
        // Currently reading via commented lines, whereas Config on Desktop v1 will have defaults set...
        await ensureDir(path.join(dbmsRoot, config.get('#dbms.directories.run')));
        await ensureDir(path.join(dbmsRoot, config.get('#dbms.directories.logs')));
        await ensureFile(path.join(dbmsRoot, config.get('#dbms.directories.logs'), 'neo4j.log'));
    }

    private async updateAccountDbmsConfig(uuid: string, name: string): Promise<void> {
        const accountConfig = JSON.parse(
            await readFile(
                path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );
        accountConfig.dbmss[uuid] = {
            id: uuid,
            name,
            description: '',
        };
        await writeJson(
            path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
            accountConfig,
        );
    }

    private async discoverDbmss(): Promise<void> {
        const fileNames = await readdir(this.getDbmsRootPath(null));
        const configDbmss = this.config.dbmss || {};

        await Promise.all(
            map(fileNames, async (fileName) => {
                const fileStats = await stat(path.join(this.getDbmsRootPath(null), fileName));
                if (fileStats.isDirectory() && fileName.startsWith('dbms-')) {
                    const id = fileName.replace('dbms-', '');
                    this.dbmss[id] = configDbmss[id] || {
                        description: '',
                        id,
                        name: '',
                    };
                }
            }),
        );
    }
}
