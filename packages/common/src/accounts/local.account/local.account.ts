import fse from 'fs-extra';
import _ from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {coerce, satisfies} from 'semver';
import path from 'path';
import * as rxjs from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result, Str} from 'tapestry';

import {IDbms, AccountConfigModel, IDbmsVersion} from '../../models';
import {AccountAbstract} from '../account.abstract';
import {PropertiesFile, ensureDirs} from '../../system';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    InvalidArgumentError,
    NotAllowedError,
    NotSupportedError,
    NotFoundError,
    InvalidConfigError,
} from '../../errors';
import {
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HOST,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONF_FILE_BACKUP,
    NEO4J_CONFIG_KEYS,
    NEO4J_EDITION,
    NEO4J_SUPPORTED_VERSION_RANGE,
    ACCOUNTS_DIR_NAME,
    NEO4J_JWT_ADDON_NAME,
    NEO4J_JWT_ADDON_VERSION,
    NEO4J_PLUGIN_DIR,
    NEO4J_CERT_DIR,
    NEO4J_JWT_CONF_FILE,
} from '../account.constants';
import {JSON_FILE_EXTENSION} from '../../constants';
import {envPaths, parseNeo4jConfigPort, isValidUrl, isValidPath} from '../../utils';
import {
    resolveDbms,
    elevatedNeo4jWindowsCmd,
    neo4jCmd,
    neo4jAdminCmd,
    fetchNeo4jVersions,
    discoverNeo4jDistributions,
    generatePluginCerts,
    downloadNeo4j,
    extractFromArchive,
} from './utils';

export class LocalAccount extends AccountAbstract {
    private dbmss: {[id: string]: IDbms} = {};

    private readonly dirPaths = {
        ...envPaths(),
        neo4jDistribution: path.join(envPaths().cache, 'neo4j'),
    };

    public get id(): string {
        return this.config.id;
    }

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await this.discoverDbmss();
    }

    async listDbmsVersions(): Promise<IDbmsVersion[]> {
        const cached = await discoverNeo4jDistributions(this.dirPaths.neo4jDistribution);
        const online = await fetchNeo4jVersions();

        return [...cached, ...online];
    }

    async installDbms(name: string, credentials: string, version: string): Promise<string> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        if (coerce(version) && coerce(version)!.version && !isValidUrl(version) && !isValidPath(version)) {
            const {version: semver} = coerce(version)!;

            if (!satisfies(semver, NEO4J_SUPPORTED_VERSION_RANGE)) {
                throw new NotSupportedError(`version not in range ${NEO4J_SUPPORTED_VERSION_RANGE}`);
            }

            let requestedDistribution = _.find(
                await discoverNeo4jDistributions(this.dirPaths.neo4jDistribution),
                (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === semver,
            );

            // if cached version of neo4j doesn't exist, attempt to download
            if (!requestedDistribution) {
                await downloadNeo4j(semver, this.dirPaths.neo4jDistribution);
                const requestedDistributionAfterDownload = _.find(
                    await discoverNeo4jDistributions(this.dirPaths.neo4jDistribution),
                    (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === semver,
                );
                if (!requestedDistributionAfterDownload) {
                    throw new NotFoundError(`Unable to find the requested version: ${version} online`);
                }
                requestedDistribution = requestedDistributionAfterDownload;
            }

            return this.installNeo4j(name, credentials, this.getDbmsRootPath(), requestedDistribution.dist);
        }

        // version as a URL.
        if (isValidUrl(version)) {
            throw new NotSupportedError(`fetch and install ${version}`);
        }

        // version as a file path.
        if ((await fse.pathExists(version)) && (await fse.stat(version)).isFile()) {
            const {extractedDistPath} = await extractFromArchive(version, this.dirPaths.neo4jDistribution);
            return this.installNeo4j(name, credentials, this.getDbmsRootPath(), extractedDistPath);
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
        const config = await PropertiesFile.readFile(path.join(dbmsRootPath, NEO4J_CONF_DIR, NEO4J_CONF_FILE));
        const host = config.get(NEO4J_CONFIG_KEYS.DEFAULT_LISTEN_ADDRESS) || DEFAULT_NEO4J_HOST;
        const port = parseNeo4jConfigPort(config.get(NEO4J_CONFIG_KEYS.BOLT_LISTEN_ADDRESS) || DEFAULT_NEO4J_BOLT_PORT);
        try {
            const driver = new Driver<Result>({
                connectionConfig: {
                    authToken,
                    host,
                    port,
                },
            });

            const token = await driver
                .query('CALL jwt.security.requestAccess($appId)', {appId})
                .pipe(
                    rxjs.first(({type}) => type === DRIVER_RESULT_TYPE.RECORD),
                    rxjs.flatMap((rec) => rec.getFieldData('token').getOrElse(Str.EMPTY)),
                )
                .toPromise()
                .finally(() => driver.shutDown().toPromise());

            if (!token) {
                throw new InvalidArgumentError('Unable to create access token');
            }

            return token;
        } catch (e) {
            throw new InvalidConfigError('Unable to connect to DBMS');
        }
    }

    private getDbmsRootPath(dbmsId?: string): string {
        const dbmssDir = path.join(this.config.neo4jDataPath || this.dirPaths.data, 'dbmss');

        if (dbmsId) {
            return path.join(dbmssDir, `dbms-${dbmsId}`);
        }

        return dbmssDir;
    }

    private async installNeo4j(
        name: string,
        credentials: string,
        dbmssDir: string,
        extractedDistPath: string,
    ): Promise<string> {
        if (!(await fse.pathExists(extractedDistPath))) {
            throw new AmbiguousTargetError(`Path to Neo4j distribution does not exist "${extractedDistPath}"`);
        }
        const dbmsId = uuidv4();
        const dbmsIdFilename = `dbms-${dbmsId}`;

        if (await fse.pathExists(path.join(dbmssDir, dbmsIdFilename))) {
            throw new DbmsExistsError(`${dbmsIdFilename} already exists`);
        }

        await fse.copy(extractedDistPath, path.join(dbmssDir, dbmsIdFilename));
        await this.updateAccountDbmsConfig(dbmsId, {name});

        const config = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        config.set('dbms.security.auth_enabled', true);
        config.set('dbms.memory.heap.initial_size', '512m');
        config.set('dbms.memory.heap.max_size', '1G');
        config.set('dbms.memory.pagecache.size', '512m');
        if (process.platform === 'win32') {
            config.set(`dbms.windows_service_name`, `neo4j-relate-dbms-${dbmsId}`);
        }

        await config.flush();

        if (process.platform === 'win32') {
            await elevatedNeo4jWindowsCmd(this.getDbmsRootPath(dbmsId), 'install-service');
        }

        await this.ensureDbmsStructure(dbmsId, config);
        await config.backupPropertiesFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE_BACKUP),
        );
        await this.setInitialDatabasePassword(dbmsId, credentials);
        await this.installSecurityPlugin(dbmsId);

        // will come back to check the installPluginDependencies situation in future PRs
        return dbmsId;
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

    private async installSecurityPlugin(dbmsId: string): Promise<void> {
        const pathToDbms = this.getDbmsRootPath(dbmsId);
        const pluginSource = path.join(this.dirPaths.cache, `${NEO4J_JWT_ADDON_NAME}-${NEO4J_JWT_ADDON_VERSION}.jar`);
        const pluginTarget = path.join(
            pathToDbms,
            NEO4J_PLUGIN_DIR,
            `${NEO4J_JWT_ADDON_NAME}-${NEO4J_JWT_ADDON_VERSION}.jar`,
        );
        const publicKeyTarget = path.join(pathToDbms, NEO4J_CERT_DIR, 'security.cert.pem');
        const privateKeyTarget = path.join(pathToDbms, NEO4J_CERT_DIR, 'security.key.pem');
        // @todo: figure out a better passphrase that's not publicly available
        const {publicKey, privateKey} = generatePluginCerts(dbmsId);

        await fse.copy(pluginSource, pluginTarget);
        await fse.writeFile(publicKeyTarget, publicKey, 'utf8');
        await fse.writeFile(privateKeyTarget, privateKey, 'utf8');

        const neo4jConfig = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        neo4jConfig.set(
            `dbms.security.authentication_providers`,
            `plugin-com.neo4j.plugin.jwt.auth.JwtAuthPlugin,native`,
        );
        neo4jConfig.set(
            `dbms.security.authorization_providers`,
            `plugin-com.neo4j.plugin.jwt.auth.JwtAuthPlugin,native`,
        );
        neo4jConfig.set(`dbms.security.procedures.unrestricted`, `jwt.security.*`);

        await neo4jConfig.flush();

        const jwtConfigPath = path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_JWT_CONF_FILE);

        await fse.ensureFile(jwtConfigPath);

        const jwtConfig = await PropertiesFile.readFile(path.join(jwtConfigPath));

        jwtConfig.set(`jwt.auth.public_key`, `${NEO4J_CERT_DIR}/security.cert.pem`);
        jwtConfig.set(`jwt.auth.private_key`, `${NEO4J_CERT_DIR}/security.key.pem`);
        jwtConfig.set(`jwt.auth.private_key_password`, dbmsId);

        await jwtConfig.flush();
    }

    private async ensureDbmsStructure(dbmsID: string, config: PropertiesFile): Promise<void> {
        const dbmsRoot = this.getDbmsRootPath(dbmsID);

        await fse.ensureDir(path.join(dbmsRoot, config.get('dbms.directories.run')));
        await fse.ensureDir(path.join(dbmsRoot, config.get('dbms.directories.logs')));
        await fse.ensureFile(path.join(dbmsRoot, config.get('dbms.directories.logs'), 'neo4j.log'));
    }

    private async updateAccountDbmsConfig(uuid: string, update: Partial<Omit<IDbms, 'id'>>): Promise<void> {
        const accountConfig = JSON.parse(
            await fse.readFile(
                path.join(this.dirPaths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );
        accountConfig.dbmss = {
            ...accountConfig.dbmss,
            [uuid]: {
                ...update,
                id: uuid,
            },
        };
        await fse.writeJson(
            path.join(this.dirPaths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
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
                path.join(this.dirPaths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );

        accountConfig.dbmss = _.omit(accountConfig.dbmss, uuid);

        await fse.writeJson(
            path.join(this.dirPaths.config, ACCOUNTS_DIR_NAME, `${this.config.id}${JSON_FILE_EXTENSION}`),
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

        const root = this.getDbmsRootPath();
        const fileNames = await fse.readdir(root);
        const configDbmss = this.config.dbmss || {};

        await Promise.all(
            _.map(fileNames, async (fileName) => {
                const fileStats = await fse.stat(path.join(root, fileName));
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
