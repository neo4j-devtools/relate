import {Dict, List, Maybe, None, Str} from '@relate/types';
import fse from 'fs-extra';
import {coerce, satisfies} from 'semver';
import path from 'path';
import {IAuthToken} from '@huboneo/tapestry';
import * as rxjs from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';

import {DbmssAbstract} from './dbmss.abstract';
import {IDbms, IDbmsConfig, IDbmsInfo, IDbmsVersion} from '../../models';
import {
    discoverNeo4jDistributions,
    downloadNeo4j,
    elevatedNeo4jWindowsCmd,
    extractNeo4j,
    fetchNeo4jVersions,
    generatePluginCerts,
    getDistributionInfo,
    neo4jAdminCmd,
    neo4jCmd,
    resolveDbms,
} from '../../utils/dbmss';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    InvalidArgumentError,
    NotAllowedError,
    NotFoundError,
    NotSupportedError,
} from '../../errors';
import {isValidUrl} from '../../utils/generic';
import {
    LocalEnvironment,
    LOCALHOST_IP_ADDRESS,
    NEO4J_CERT_DIR,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONF_FILE_BACKUP,
    NEO4J_EDITION,
    NEO4J_JWT_ADDON_NAME,
    NEO4J_JWT_ADDON_VERSION,
    NEO4J_JWT_CONF_FILE,
    NEO4J_PLUGIN_DIR,
    NEO4J_SUPPORTED_VERSION_RANGE,
} from '../environments';
import {BOLT_DEFAULT_PORT, DBMS_STATUS, DBMS_STATUS_FILTERS, DBMS_TLS_LEVEL} from '../../constants';
import {PropertiesFile} from '../../system/files';
import {NEO4J_DB_NAME_REGEX} from './dbmss.constants';
import {CypherParameterError} from '../../errors/cypher-parameter.error';
import {systemDbQuery} from '../../utils/dbmss/system-db-query';

export class LocalDbmss extends DbmssAbstract<LocalEnvironment> {
    async versions(): Promise<List<IDbmsVersion>> {
        const cached = await discoverNeo4jDistributions(this.environment.dirPaths.dbmssCache);
        const online = await fetchNeo4jVersions();
        const allVersions = cached.concat(online);

        return allVersions
            .mapEach((version) => {
                if (version.origin === 'cached') {
                    return version;
                }

                return allVersions
                    .find(
                        (cachedVersion) =>
                            cachedVersion.origin === 'cached' &&
                            cachedVersion.version === version.version &&
                            cachedVersion.edition === version.edition,
                    )
                    .flatMap((found) => {
                        if (None.isNone(found)) {
                            return version;
                        }

                        return None.EMPTY;
                    });
            })
            .compact();
    }

    async install(name: string, credentials: string, version: string): Promise<string> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        let dbmsExists;
        try {
            await this.get(name);
            dbmsExists = true;
        } catch {
            dbmsExists = false;
        }

        if (dbmsExists) {
            throw new DbmsExistsError(`DBMS with name "${name}" already exists`);
        }

        // version as a file path.
        if ((await fse.pathExists(version)) && (await fse.stat(version)).isFile()) {
            const {extractedDistPath} = await extractNeo4j(version, this.environment.dirPaths.dbmssCache);
            return this.installNeo4j(name, credentials, this.getDbmsRootPath(), extractedDistPath);
        }

        // @todo: version as a URL.
        if (isValidUrl(version)) {
            throw new NotSupportedError(`fetch and install ${version}`);
        }

        const coercedVersion = coerce(version)?.version;
        if (coercedVersion) {
            if (!satisfies(coercedVersion, NEO4J_SUPPORTED_VERSION_RANGE)) {
                throw new NotSupportedError(`version not in range ${NEO4J_SUPPORTED_VERSION_RANGE}`);
            }

            const beforeDownload = await discoverNeo4jDistributions(this.environment.dirPaths.dbmssCache);
            const requestedDistribution = beforeDownload.find(
                (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === coercedVersion,
            );

            const found = await requestedDistribution.flatMap(async (dist) => {
                if (None.isNone(dist)) {
                    await downloadNeo4j(coercedVersion, this.environment.dirPaths.dbmssCache);
                    const afterDownload = await discoverNeo4jDistributions(this.environment.dirPaths.dbmssCache);

                    return afterDownload.find(
                        (down) => down.edition === NEO4J_EDITION.ENTERPRISE && down.version === coercedVersion,
                    );
                }

                return Maybe.of(dist);
            });

            return found.flatMap((dist) => {
                if (None.isNone(dist)) {
                    throw new NotFoundError(`Unable to find the requested version: ${version} online`);
                }

                return this.installNeo4j(name, credentials, this.getDbmsRootPath(), dist.dist);
            });
        }

        throw new InvalidArgumentError('Provided version argument is not valid semver, url or path.');
    }

    async uninstall(nameOrId: string): Promise<void> {
        const {id} = resolveDbms(this.dbmss, nameOrId);
        const status = Str.from(await neo4jCmd(this.getDbmsRootPath(id), 'status'));

        if (!status.includes('Neo4j is not running')) {
            throw new NotAllowedError('Cannot uninstall DBMS that is not stopped');
        }

        return this.uninstallNeo4j(id);
    }

    start(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId).id)
            .mapEach((id) => neo4jCmd(this.getDbmsRootPath(id), 'start'))
            .unwindPromises();
    }

    stop(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId).id)
            .mapEach((id) => neo4jCmd(this.getDbmsRootPath(id), 'stop'))
            .unwindPromises();
    }

    info(nameOrIds: string[] | List<string>): Promise<List<IDbmsInfo>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId))
            .mapEach(async (dbms) => {
                const v = dbms.rootPath ? await getDistributionInfo(dbms.rootPath) : null;
                const statusMessage = Str.from(await neo4jCmd(this.getDbmsRootPath(dbms.id), 'status'));
                const status = statusMessage.includes(DBMS_STATUS_FILTERS.STARTED)
                    ? DBMS_STATUS.STARTED
                    : DBMS_STATUS.STOPPED;

                return {
                    id: dbms.id,
                    name: dbms.name,
                    description: dbms.description,
                    rootPath: dbms.rootPath,
                    connectionUri: dbms.connectionUri,
                    status,
                    version: v?.version,
                    edition: v?.edition,
                };
            })
            .unwindPromises();
    }

    async updateConfig(nameOrId: string, properties: Map<string, string>): Promise<boolean> {
        const dbmsId = resolveDbms(this.dbmss, nameOrId).id;
        const neo4jConfig = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        properties.forEach((value, key) => neo4jConfig.set(key, value));

        await neo4jConfig.flush();

        return true;
    }

    async list(): Promise<List<IDbms>> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.discoverDbmss();

        return Dict.from(this.dbmss).values;
    }

    async get(nameOrId: string): Promise<IDbms> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.discoverDbmss();

        return resolveDbms(this.dbmss, nameOrId);
    }

    async createAccessToken(appName: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const dbms = await this.get(dbmsNameOrId);
        const driver = await this.getJSONDriverInstance(dbms.id, authToken);

        const token = await this.runQuery<string>(driver, 'CALL jwt.security.requestAccess($appName)', {appName})
            .pipe(
                rxjs.first(),
                rxjs.flatMap((rec) => rec.data),
            )
            .toPromise()
            .finally(() => driver.shutDown().toPromise());

        if (!token) {
            throw new InvalidArgumentError('Unable to create access token');
        }

        return token;
    }

    async createDb(dbmsId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
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

    async dropDb(dbmsId: string, dbmsUser: string, dbName: string, accessToken: string): Promise<void> {
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

    private getDbmsRootPath(dbmsId?: string): string {
        const dbmssDir = path.join(this.environment.dirPaths.dbmssData);

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
            throw new DbmsExistsError(`DBMS with name ${dbmsIdFilename} already exists`);
        }

        await fse.copy(extractedDistPath, path.join(dbmssDir, dbmsIdFilename));
        await this.setDbmsManifest(dbmsId, {name});

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

        return fse.remove(dbmsDir).then(() => this.deleteDbmsManifest(dbmsId));
    }

    private setInitialDatabasePassword(dbmsID: string, credentials: string): Promise<string> {
        return neo4jAdminCmd(this.getDbmsRootPath(dbmsID), 'set-initial-password', credentials);
    }

    private async installSecurityPlugin(dbmsId: string): Promise<void> {
        const pathToDbms = this.getDbmsRootPath(dbmsId);
        const pluginSource = path.join(
            this.environment.dirPaths.cache,
            `${NEO4J_JWT_ADDON_NAME}-${NEO4J_JWT_ADDON_VERSION}.jar`,
        );
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

        // @todo: can we make these more guaranteed?
        await fse.ensureDir(path.join(dbmsRoot, config.get('dbms.directories.run')!));
        await fse.ensureDir(path.join(dbmsRoot, config.get('dbms.directories.logs')!));
        await fse.ensureFile(path.join(dbmsRoot, config.get('dbms.directories.logs')!, 'neo4j.log'));
    }

    private async discoverDbmss(): Promise<void> {
        this.dbmss = {};

        const root = this.getDbmsRootPath();
        const files = await List.from(await fse.readdir(root))
            .filter((file) => file.startsWith('dbms-'))
            .mapEach((file) => fse.stat(path.join(root, file)).then((stats) => (stats.isDirectory() ? file : null)))
            .unwindPromises();

        await files
            .compact()
            .mapEach(async (fileName) => {
                const fullPath = path.join(root, fileName);
                const confPath = path.join(fullPath, NEO4J_CONF_DIR, NEO4J_CONF_FILE);
                const hasConf = await fse.pathExists(confPath);

                if (hasConf && fileName.startsWith('dbms-')) {
                    const id = fileName.replace('dbms-', '');
                    const neo4jConfig = await this.getDbmsConfig(id);
                    // @todo: verify these settings with driver team
                    const tlsLevel = neo4jConfig.get('dbms.connector.bolt.tls_level') || DBMS_TLS_LEVEL.DISABLED;
                    const protocol = tlsLevel !== DBMS_TLS_LEVEL.DISABLED ? 'neo4j+s://' : 'neo4j://';
                    const host = neo4jConfig.get('dbms.default_advertised_address') || LOCALHOST_IP_ADDRESS;
                    const port = neo4jConfig.get('dbms.connector.bolt.listen_address') || BOLT_DEFAULT_PORT;
                    const configDbmss = await this.getDbmsManifest(id);
                    const overrides = {
                        config: neo4jConfig,
                        connectionUri: `${protocol}${host}${port}`,
                        id,
                        rootPath: fullPath,
                    };

                    this.dbmss[id] = configDbmss.merge(overrides).toObject();
                }
            })
            .unwindPromises();
    }

    public getDbmsConfig(dbmsId: string): Promise<PropertiesFile> {
        const configFileName = path.join(
            this.environment.dirPaths.dbmssData,
            `dbms-${dbmsId}`,
            NEO4J_CONF_DIR,
            NEO4J_CONF_FILE,
        );

        return PropertiesFile.readFile(configFileName);
    }

    private async getDbmsManifest(dbmsId: string): Promise<Dict<IDbmsConfig>> {
        const configFileName = path.join(this.environment.dirPaths.dbmssData, `dbms-${dbmsId}.json`);
        const defaultValues = {
            description: '',
            name: '',
        };

        if (!(await fse.pathExists(configFileName))) {
            return Dict.from({
                ...defaultValues,
                id: dbmsId,
            });
        }

        try {
            const config = await fse.readJson(configFileName);

            return Dict.from({
                ...defaultValues,
                ...config,
                id: dbmsId,
            });
        } catch (e) {
            return Dict.from({
                ...defaultValues,
                id: dbmsId,
            });
        }
    }

    private async setDbmsManifest(dbmsId: string, update: Partial<Omit<IDbms, 'id'>>): Promise<void> {
        const configFileName = path.join(this.environment.dirPaths.dbmssData, `dbms-${dbmsId}.json`);
        const config = await this.getDbmsManifest(dbmsId);
        const updated = {
            ...config.toObject(),
            ...update,
            id: dbmsId,
        };

        await fse.writeJson(configFileName, updated);
        return this.discoverDbmss();
    }

    private async deleteDbmsManifest(dbmsId: string): Promise<void> {
        const configFileName = path.join(this.environment.dirPaths.dbmssData, `dbms-${dbmsId}.json`);

        await fse.unlink(configFileName);

        return this.discoverDbmss();
    }
}
