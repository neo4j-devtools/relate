import fse from 'fs-extra';
import _ from 'lodash';
import decompress from 'decompress';
import {v4 as uuidv4} from 'uuid';
import {coerce, satisfies} from 'semver';
import path from 'path';
import rxjs from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result, Str} from 'tapestry';

import {IDbms, AccountConfigModel} from '../../models/account-config.model';
import {parseNeo4jConfigPort, readPropertiesFile, isValidUrl, isValidPath} from '../../utils';
import {PropertiesFile} from '../../properties-file';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    InvalidArgumentError,
    NotAllowedError,
    NotSupportedError,
    FileStructureError,
} from '../../errors';
import {
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HOST,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONF_FILE_BACKUP,
    NEO4J_CONFIG_KEYS,
    NEO4J_EDITION_ENTERPRISE,
    NEO4J_SUPPORTED_VERSION_RANGE,
    ACCOUNTS_DIR_NAME,
} from '../account.constants';
import {JSON_FILE_EXTENSION} from '../../constants';
import {envPaths} from '../../utils/env-paths';
import {resolveDbms} from './resolve-dbms';
import {AccountAbstract} from '../account.abstract';
import {elevatedNeo4jWindowsCmd, neo4jCmd} from './neo4j-cmd';
import {neo4jAdminCmd} from './neo4j-admin-cmd';
import {fetchNeo4jVersions, getDownloadedNeo4jDistributions} from './dbms-versions';

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

        if (coerce(version) && coerce(version)!.version && !isValidUrl(version) && !isValidPath(version)) {
            const {version: semver} = coerce(version)!;
            if (!satisfies(semver, NEO4J_SUPPORTED_VERSION_RANGE)) {
                return Promise.reject(new NotSupportedError(`version not in range ${NEO4J_SUPPORTED_VERSION_RANGE}`));
            }
            const neo4jDistributions = await getDownloadedNeo4jDistributions(this.paths.cache);
            const neo4jDistributionExists = _.some(neo4jDistributions, (neo4jDistribution) => {
                return neo4jDistribution.edition === NEO4J_EDITION_ENTERPRISE && neo4jDistribution.version === semver;
            });

            if (!neo4jDistributionExists) {
                // to complete in a future PR
                await fetchNeo4jVersions();
                throw new NotSupportedError('version doesnt exist, so will attempt to download and install');
            }

            const distributionArchiveFileName = `neo4j-${NEO4J_EDITION_ENTERPRISE}-${semver}${
                process.platform === 'win32' ? '-windows.zip' : '-unix.tar.gz'
            }`;
            const distributionPath = path.join(this.paths.cache, 'neo4j', distributionArchiveFileName);

            const outputDir = this.getDbmsRootPath(null);
            const cacheDir = path.join(this.paths.cache, 'neo4j');
            // can rework this section once the listing of dbmss goes in, will be easier to reason about.
            const outputDirName = await this.extractFromArchive(distributionPath, outputDir, cacheDir, semver);
            return this.installNeo4j(name, credentials, outputDir, outputDirName);
        }

        // version as a URL.
        if (isValidUrl(version)) {
            throw new NotSupportedError(`fetch and install ${version}`);
        }

        // version as a file path.
        if ((await fse.pathExists(version)) && (await fse.stat(version)).isFile()) {
            const outputDir = this.getDbmsRootPath(null);
            const cacheDir = path.join(this.paths.cache, 'neo4j');
            const outputDirName = await this.extractFromArchive(version, outputDir, cacheDir);
            return this.installNeo4j(name, credentials, outputDir, outputDirName);
        }

        throw new InvalidArgumentError('Provided version argument is not valid semver, url or path.');
    }

    async uninstallDbms(nameOrId: string): Promise<void> {
        const {id} = resolveDbms(this.dbmss, nameOrId);
        const status = await neo4jCmd(this.getDbmsRootPath(id), 'status');

        if (!_.includes(status, 'Neo4j is not running')) {
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
                rxjs.filter(({type}) => type === DRIVER_RESULT_TYPE.RECORD),
                rxjs.first(),
                rxjs.flatMap((rec) => rec.getFieldData('token').getOrElse(Str.EMPTY)),
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
        credentials: string,
        distributionPath: string,
        outputDirName: string,
    ): Promise<string> {
        await fse.ensureDir(path.join(this.paths.cache, 'neo4j'));
        const dbmsId = uuidv4();
        const dbmsIdFilename = `dbms-${dbmsId}`;

        if (await fse.pathExists(path.join(distributionPath, dbmsIdFilename))) {
            return Promise.reject(new DbmsExistsError(`${dbmsIdFilename} already exists`));
        }

        await fse.rename(path.join(distributionPath, outputDirName), path.join(distributionPath, dbmsIdFilename));
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

    private async extractFromArchive(
        distributionPath: string,
        outputDir: string,
        cacheDir: string,
        version?: string,
    ): Promise<string> {
        const outputFiles = await decompress(distributionPath, cacheDir);
        let outputDirName;

        // if no version passed in, determine output dir filename from the shortest directory string path
        if (!version) {
            const outputTopLevelDir = _.reduce(
                _.filter(outputFiles, (file) => file.type === 'directory'),
                (a, b) => (a.path.length <= b.path.length ? a : b),
            );
            if (!outputTopLevelDir) {
                await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(cacheDir, file.path))));
                throw new FileStructureError(`Unexpected file structure after unpacking`);
            }
            outputDirName = outputTopLevelDir.path;
        } else {
            outputDirName = `neo4j-${NEO4J_EDITION_ENTERPRISE}-${version}`;
        }

        // check if this is neo4j...
        try {
            await neo4jCmd(path.join(cacheDir, outputDirName), 'status');
            await fse.copy(path.join(cacheDir, outputDirName), path.join(outputDir, outputDirName));
            return outputDirName;
        } catch (e) {
            await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(cacheDir, file.path))));
            throw e;
        }
    }

    private async uninstallNeo4j(dbmsId: string): Promise<void> {
        const dbmsDir = this.getDbmsRootPath(dbmsId);
        const found = await fse.pathExists(dbmsDir);

        if (!found) {
            throw new AmbiguousTargetError(`DBMS ${dbmsId} not found`);
        }

        if (process.platform === 'win32') {
            await elevatedNeo4jWindowsCmd(this.getDbmsRootPath(dbmsId), 'uninstall-service');
        }

        return fse.remove(dbmsDir).then(() => this.deleteAccountDbmsConfig(dbmsId));
    }

    private setInitialDatabasePassword(dbmsID: string, credentials: string): Promise<string> {
        return neo4jAdminCmd(this.getDbmsRootPath(dbmsID), 'set-initial-password', credentials);
    }

    private async ensureStructure(dbmsID: string, config: PropertiesFile): Promise<void> {
        const dbmsRoot = this.getDbmsRootPath(dbmsID);
        await fse.ensureDir(path.join(dbmsRoot, await config.get('dbms.directories.run')));
        await fse.ensureDir(path.join(dbmsRoot, await config.get('dbms.directories.logs')));
        await fse.ensureFile(path.join(dbmsRoot, await config.get('dbms.directories.logs'), 'neo4j.log'));
    }

    private async updateAccountDbmsConfig(uuid: string, update: Partial<Omit<IDbms, 'id'>>): Promise<void> {
        const accountConfig = JSON.parse(
            await fse.readFile(
                path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );
        accountConfig.dbmss[uuid] = {
            ...update,
            id: uuid,
        };
        await fse.writeJson(
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
            await fse.readFile(
                path.join(this.paths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );

        accountConfig.dbmss = _.omit(accountConfig.dbmss, uuid);

        await fse.writeJson(
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

        const fileNames = await fse.readdir(this.getDbmsRootPath(null));
        const configDbmss = this.config.dbmss || {};

        await Promise.all(
            _.map(fileNames, async (fileName) => {
                const fileStats = await fse.stat(path.join(this.getDbmsRootPath(null), fileName));
                if (fileStats.isDirectory() && fileName.startsWith('dbms-')) {
                    const id = fileName.replace('dbms-', '');
                    const defaultValues = {
                        description: '',
                        name: '',
                    };

                    this.dbmss[id] = _.merge(defaultValues, configDbmss[id], {
                        id,
                    });
                }
            }),
        );
    }
}
