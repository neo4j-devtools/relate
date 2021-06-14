import {Dict, List, Maybe, None, Str} from '@relate/types';
import fse from 'fs-extra';
import semver, {coerce, satisfies} from 'semver';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import {throttle} from 'lodash';

import {DbmssAbstract} from './dbmss.abstract';
import {
    IDbms,
    IDbmsInfo,
    IDbmsVersion,
    DbmsManifestModel,
    IDbmsUpgradeOptions,
    IAuthToken,
    IQueryTarget,
} from '../../models';
import {
    discoverNeo4jDistributions,
    downloadNeo4j,
    extractNeo4j,
    fetchNeo4jVersions,
    generatePluginCerts,
    getDistributionInfo,
    neo4jAdminCmd,
    neo4jCmd,
    resolveDbms,
    supportsAccessTokens,
    isDbmsOnline,
    upgradeNeo4j,
} from '../../utils/dbmss';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    DbmsQueryError,
    InvalidArgumentError,
    NotAllowedError,
    NotFoundError,
    NotSupportedError,
} from '../../errors';
import {applyEntityFilters, IRelateFilter, isValidUrl} from '../../utils/generic';
import {
    LocalEnvironment,
    LOCALHOST_IP_ADDRESS,
    NEO4J_CERT_DIR,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONF_FILE_BACKUP,
    NEO4J_EDITION,
    NEO4J_JWT_ADDON_NAME,
    NEO4J_JWT_CONF_FILE,
    NEO4J_SUPPORTED_VERSION_RANGE,
    NEO4J_ACCESS_TOKEN_SUPPORT_VERSION_RANGE,
} from '../environments';
import {
    BOLT_DEFAULT_PORT,
    DBMS_MANIFEST_FILE,
    DBMS_SERVER_STATUS,
    DBMS_STATUS,
    DBMS_STATUS_FILTERS,
    DBMS_TLS_LEVEL,
    DISCOVER_DBMS_THROTTLE_MS,
    ENTITY_TYPES,
} from '../../constants';
import {PropertiesFile} from '../../system/files';
import {winNeo4jStart, winNeo4jStatus} from '../../utils/dbmss/neo4j-process-win';
import {ManifestLocal} from '../manifest';
import {isSymlink} from '../../utils/files';
import {signalStop, procedureStop} from '../../utils/dbmss/dbms-stop';

export class LocalDbmss extends DbmssAbstract<LocalEnvironment> {
    public readonly manifest = new ManifestLocal(
        this.environment,
        ENTITY_TYPES.DBMS,
        DbmsManifestModel,
        (nameOrId: string) => this.get(nameOrId),
        () => this.discoverDbmss(),
    );

    async versions(limited?: boolean, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbmsVersion>> {
        const cached = await discoverNeo4jDistributions(this.environment.dirPaths.dbmssCache);
        const online = await fetchNeo4jVersions(limited);
        const allVersions = cached.concat(online);
        const mapped = allVersions
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

        return applyEntityFilters(mapped, filters);
    }

    async install(
        name: string,
        version: string,
        edition: NEO4J_EDITION = NEO4J_EDITION.ENTERPRISE,
        credentials = '',
        overrideCache = false,
        limited = false,
    ): Promise<IDbmsInfo> {
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
            const tmpPath = path.join(this.environment.dirPaths.tmp, uuidv4());
            const {extractedDistPath} = await extractNeo4j(version, tmpPath);
            const dbms = await this.installNeo4j(name, this.getDbmsRootPath(), extractedDistPath, credentials);

            await fse.remove(tmpPath);

            return dbms;
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
                (dist) => dist.version === coercedVersion && dist.edition === edition,
            );
            const found = await requestedDistribution.flatMap(async (dist) => {
                const shouldDownload = overrideCache || None.isNone(dist);

                if (shouldDownload && !None.isNone(dist)) {
                    await fse.remove(dist.dist);
                }

                if (shouldDownload) {
                    await downloadNeo4j(coercedVersion, edition, this.environment.dirPaths.dbmssCache, limited);
                    const afterDownload = await discoverNeo4jDistributions(this.environment.dirPaths.dbmssCache);

                    return afterDownload.find((down) => down.version === coercedVersion && down.edition === edition);
                }

                return Maybe.of(dist);
            });

            return found.flatMap((dist) => {
                if (None.isNone(dist)) {
                    throw new NotFoundError(`Unable to find the requested version: ${version}-${edition} online`);
                }

                return this.installNeo4j(name, this.getDbmsRootPath(), dist.dist, credentials);
            });
        }

        throw new InvalidArgumentError('Provided version argument is not valid semver, url or path.');
    }

    upgrade(dbmsId: string, version: string, options: IDbmsUpgradeOptions = {migrate: true}): Promise<IDbmsInfo> {
        if (!semver.satisfies(version, NEO4J_SUPPORTED_VERSION_RANGE)) {
            throw new InvalidArgumentError(`Version not in range ${NEO4J_SUPPORTED_VERSION_RANGE}`, [
                'Use valid version',
            ]);
        }

        return upgradeNeo4j(this.environment, dbmsId, version, options);
    }

    async link(externalPath: string, name: string): Promise<IDbmsInfo> {
        // Make sure the path we're getting is an actual DBMS
        const info = await getDistributionInfo(externalPath);
        if (!info || !semver.satisfies(info.version, NEO4J_SUPPORTED_VERSION_RANGE)) {
            throw new InvalidArgumentError(`Path "${externalPath}" does not seem to be a valid neo4j DBMS`, [
                'Use a valid path',
            ]);
        }

        const manifestPath = path.join(externalPath, DBMS_MANIFEST_FILE);
        const manifestExists = await fse.pathExists(manifestPath);

        // If a manifest exists in the target, path use it
        /* eslint-disable indent */
        const rawManifest = manifestExists
            ? await fse.readJSON(manifestPath, {encoding: 'utf-8'})
            : {
                  name,
                  id: uuidv4(),
              };
        /* eslint-enable indent */
        const manifestModel = new DbmsManifestModel(rawManifest);

        // Don't override existing data
        const dbmsExists = await this.environment.entityExists(ENTITY_TYPES.DBMS, manifestModel.id);
        if (dbmsExists) {
            throw new InvalidArgumentError(`DBMS "${manifestModel.name}" already managed by relate`);
        }

        // Replace broken symlinks
        const dbmsPath = this.environment.getEntityRootPath(ENTITY_TYPES.DBMS, manifestModel.id);
        if (await isSymlink(dbmsPath)) {
            await fse.unlink(dbmsPath);
        }

        // Enforce unique names
        const dbmsNameExists = await this.getDbms(manifestModel.name).catch(() => null);
        if (dbmsNameExists) {
            throw new InvalidArgumentError(`DBMS "${manifestModel.name}" already exists`, ['Use a unique name']);
        }

        await fse.symlink(externalPath, dbmsPath, 'junction');
        await this.manifest.update(manifestModel.id, manifestModel);

        if (supportsAccessTokens(info)) {
            await this.installSecurityPlugin(manifestModel.id);
        }

        await this.discoverDbmss();
        return this.get(manifestModel.id);
    }

    async clone(id: string, name: string): Promise<IDbmsInfo> {
        if (!name) {
            throw new InvalidArgumentError(`Cloned DBMS name must be provided`);
        }

        const exists = await this.get(name).catch(() => null);

        if (exists) {
            throw new InvalidArgumentError(`DBMS ${name} already exists`);
        }

        const dbms = await this.get(id);
        const clonedId = uuidv4();

        // If the DBMS is linked the target path should be copied, not the symlink.
        const sourcePath = await fse.realpath(this.getDbmsRootPath(dbms.id));

        await fse.copy(sourcePath, this.getDbmsRootPath(clonedId));
        await this.manifest.update(clonedId, {
            name,
        });

        return this.get(clonedId);
    }

    async uninstall(nameOrId: string): Promise<IDbmsInfo> {
        const {id, status} = await this.get(nameOrId);

        if (status === DBMS_STATUS.STARTED) {
            throw new NotAllowedError('Cannot uninstall DBMS that is running');
        }

        const dbms = await this.uninstallNeo4j(id);
        delete this.dbmss[dbms.id];
        return dbms;
    }

    start(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach(async (nameOrId) => {
                const {id} = await this.getDbms(nameOrId);

                if (process.platform === 'win32') {
                    return winNeo4jStart(this.getDbmsRootPath(id));
                }

                return neo4jCmd(this.getDbmsRootPath(id), 'start');
            })
            .unwindPromises();
    }

    stop(nameOrIds: Array<string | IQueryTarget> | List<string | IQueryTarget>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach(async (nameOrId) => {
                if (typeof nameOrId === 'string') {
                    return signalStop(this.environment, nameOrId);
                }

                await procedureStop(this.environment, nameOrId);
                return '';
            })
            .unwindPromises();
    }

    info(nameOrIds: string[] | List<string>, onlineCheck?: boolean): Promise<List<IDbmsInfo>> {
        return List.from(nameOrIds)
            .mapEach(async (nameOrId) => {
                const dbms = await this.getDbms(nameOrId);
                const v = dbms.rootPath ? await getDistributionInfo(dbms.rootPath) : null;

                let status: DBMS_STATUS;

                if (process.platform === 'win32') {
                    status = await winNeo4jStatus(this.getDbmsRootPath(dbms.id));
                } else {
                    const statusMessage = Str.from(await neo4jCmd(this.getDbmsRootPath(dbms.id), 'status'));
                    status = statusMessage.includes(DBMS_STATUS_FILTERS.STARTED)
                        ? DBMS_STATUS.STARTED
                        : DBMS_STATUS.STOPPED;
                }

                let serverStatus: DBMS_SERVER_STATUS = DBMS_SERVER_STATUS.UNKNOWN;

                if (onlineCheck && status === DBMS_STATUS.STOPPED) {
                    serverStatus = DBMS_SERVER_STATUS.OFFLINE;
                }

                if (onlineCheck && status === DBMS_STATUS.STARTED) {
                    const config = await this.getDbmsConfig(dbms.id);
                    serverStatus = (await isDbmsOnline({
                        ...dbms,
                        config,
                    }))
                        ? DBMS_SERVER_STATUS.ONLINE
                        : DBMS_SERVER_STATUS.OFFLINE;
                }

                return {
                    connectionUri: await this.getConnectionUri(dbms.id),
                    description: dbms.description,
                    edition: v?.edition,
                    id: dbms.id,
                    name: dbms.name,
                    rootPath: dbms.rootPath,
                    tags: dbms.tags,
                    metadata: dbms.metadata,
                    status,
                    serverStatus,
                    version: v?.version,
                    prerelease: v?.prerelease,
                };
            })
            .unwindPromises();
    }

    async updateConfig(nameOrId: string, properties: Map<string, string>): Promise<boolean> {
        const dbmsId = await this.getDbms(nameOrId).then((dbms) => dbms.id);
        const neo4jConfig = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        properties.forEach((value, key) => neo4jConfig.set(key, value));

        await neo4jConfig.flush();

        return true;
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbms>> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.throttledDiscoverDbmss();

        return applyEntityFilters(Dict.from(this.dbmss).values, filters);
    }

    // @todo - Replace dbmss.get with this method for further performance gains.
    async getDbms(nameOrId: string): Promise<IDbms> {
        try {
            const dbms = resolveDbms(this.dbmss, nameOrId);
            if (await this.environment.entityExists(ENTITY_TYPES.DBMS, dbms.id)) {
                return dbms;
            }
        } catch {
            await this.discoverDbmss();
        }

        try {
            const dbms = resolveDbms(this.dbmss, nameOrId);
            if (await this.environment.entityExists(ENTITY_TYPES.DBMS, dbms.id)) {
                return dbms;
            }

            throw new NotFoundError(`DBMS "${nameOrId}" not found`);
        } catch (e) {
            throw new NotFoundError(`DBMS "${nameOrId}" not found`);
        }
    }

    async get(nameOrId: string, onlineCheck?: boolean): Promise<IDbmsInfo> {
        try {
            resolveDbms(this.dbmss, nameOrId);
        } catch {
            await this.discoverDbmss();
        }

        try {
            const info = await this.info([nameOrId], onlineCheck);

            return info.first.getOrElse(() => {
                throw new NotFoundError(`DBMS "${nameOrId}" not found`);
            });
        } catch (e) {
            throw new NotFoundError(`DBMS "${nameOrId}" not found`);
        }
    }

    async createAccessToken(appName: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const dbms = await this.get(dbmsNameOrId);

        if (!supportsAccessTokens(dbms)) {
            throw new NotSupportedError(
                // eslint-disable-next-line max-len
                `Only Neo4j ${NEO4J_ACCESS_TOKEN_SUPPORT_VERSION_RANGE} ${NEO4J_EDITION.ENTERPRISE} can create access tokens.`,
            );
        }

        const driver = await this.getDriverInstance(dbms.id, authToken);
        try {
            const result = await this.runReadQuery(driver, 'CALL jwt.security.requestAccess($appName)', {appName});
            const [singleRecord] = result.records;
            const token = singleRecord.get('token');
            return token;
        } catch (e) {
            throw new DbmsQueryError('Unable to create access token', e.message);
        } finally {
            await driver.close();
        }
    }

    public getDbmsRootPath(dbmsId?: string): string {
        if (dbmsId) {
            return this.environment.getEntityRootPath(ENTITY_TYPES.DBMS, dbmsId);
        }

        return this.environment.dirPaths.dbmssData;
    }

    private async installNeo4j(
        name: string,
        dbmssDir: string,
        extractedDistPath: string,
        credentials?: string,
    ): Promise<IDbmsInfo> {
        if (!(await fse.pathExists(extractedDistPath))) {
            throw new AmbiguousTargetError(`Path to Neo4j distribution does not exist "${extractedDistPath}"`);
        }
        const dbmsId = uuidv4();
        const dbmsIdFilename = `dbms-${dbmsId}`;

        if (await fse.pathExists(path.join(dbmssDir, dbmsIdFilename))) {
            throw new DbmsExistsError(`DBMS with name ${dbmsIdFilename} already exists`);
        }

        await fse.copy(extractedDistPath, path.join(dbmssDir, dbmsIdFilename));

        try {
            await this.manifest.update(dbmsId, {name});

            const neo4jConfig = await PropertiesFile.readFile(
                path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
            );

            neo4jConfig.set('dbms.security.auth_enabled', true);
            neo4jConfig.set('dbms.memory.heap.initial_size', '512m');
            neo4jConfig.set('dbms.memory.heap.max_size', '1G');
            neo4jConfig.set('dbms.memory.pagecache.size', '512m');

            if (process.platform === 'win32') {
                neo4jConfig.set(`dbms.windows_service_name`, `neo4j-relate-dbms-${dbmsId}`);
            }

            await neo4jConfig.flush();

            await this.ensureDbmsStructure(dbmsId, neo4jConfig);
            await neo4jConfig.backupPropertiesFile(
                path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE_BACKUP),
            );

            if (credentials) {
                await this.setInitialDatabasePassword(dbmsId, credentials);
            }

            const installed = await this.get(dbmsId);

            if (supportsAccessTokens(installed)) {
                await this.installSecurityPlugin(dbmsId);
            }

            return installed;
        } catch (error) {
            await fse.remove(path.join(dbmssDir, dbmsIdFilename));
            throw error;
        }
    }

    private async uninstallNeo4j(dbmsId: string): Promise<IDbmsInfo> {
        const dbms = await this.get(dbmsId);
        const dbmsRootPath = this.getDbmsRootPath(dbms.id);
        const found = await fse.pathExists(dbmsRootPath);

        if (!found) {
            throw new AmbiguousTargetError(`DBMS ${dbmsId} not found`);
        }

        await fse.unlink(dbmsRootPath).catch(() => fse.remove(dbmsRootPath));

        return dbms;
    }

    private setInitialDatabasePassword(dbmsID: string, credentials: string): Promise<string> {
        return neo4jAdminCmd(this.getDbmsRootPath(dbmsID), ['set-initial-password'], credentials);
    }

    private async installSecurityPlugin(dbmsId: string): Promise<void> {
        try {
            await this.environment.dbmsPlugins.getSource(NEO4J_JWT_ADDON_NAME);
        } catch (e) {
            if (!(e instanceof NotFoundError)) {
                throw e;
            }

            await this.environment.dbmsPlugins.addSources([
                {
                    name: NEO4J_JWT_ADDON_NAME,
                    homepageUrl: 'https://github.com/neo4j-devtools/relate',
                    versionsUrl:
                        'https://s3-eu-west-1.amazonaws.com/dist.neo4j.org/relate/neo4j-jwt-addon/versions.json',
                },
            ]);
        }

        const pKeyPassword = uuidv4();
        const pathToDbms = this.getDbmsRootPath(dbmsId);

        const publicKeyTarget = path.join(pathToDbms, NEO4J_CERT_DIR, 'security.cert.pem');
        const privateKeyTarget = path.join(pathToDbms, NEO4J_CERT_DIR, 'security.key.pem');
        const {publicKey, privateKey} = generatePluginCerts(pKeyPassword);

        await fse.writeFile(publicKeyTarget, publicKey, 'utf8');
        await fse.writeFile(privateKeyTarget, privateKey, 'utf8');

        const neo4jConfig = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        const authenticationProviders = neo4jConfig.get('dbms.security.authentication_providers');
        const authorizationProviders = neo4jConfig.get('dbms.security.authorization_providers');

        // Set the default value for authentication and authorization providers if none is present
        if (!authenticationProviders) {
            neo4jConfig.set('dbms.security.authentication_providers', 'native');
        }
        if (!authorizationProviders) {
            neo4jConfig.set('dbms.security.authorization_providers', 'native');
        }

        await neo4jConfig.flush();

        await this.environment.dbmsPlugins.install([dbmsId], NEO4J_JWT_ADDON_NAME);

        const jwtConfigPath = path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_JWT_CONF_FILE);

        await fse.ensureFile(jwtConfigPath);

        const jwtConfig = await PropertiesFile.readFile(path.join(jwtConfigPath));

        jwtConfig.set(`jwt.auth.public_key`, `${NEO4J_CERT_DIR}/security.cert.pem`);
        jwtConfig.set(`jwt.auth.private_key`, `${NEO4J_CERT_DIR}/security.key.pem`);
        jwtConfig.set(`jwt.auth.private_key_password`, pKeyPassword);

        await jwtConfig.flush();
    }

    private async ensureDbmsStructure(dbmsID: string, config: PropertiesFile): Promise<void> {
        const dbmsRoot = this.getDbmsRootPath(dbmsID);

        // @todo: can we make these more guaranteed?
        await fse.ensureDir(path.join(dbmsRoot, config.get('dbms.directories.run')!));
        await fse.ensureDir(path.join(dbmsRoot, config.get('dbms.directories.logs')!));
        await fse.ensureFile(path.join(dbmsRoot, config.get('dbms.directories.logs')!, 'neo4j.log'));
    }

    private throttledDiscoverDbmss = throttle(this.discoverDbmss, DISCOVER_DBMS_THROTTLE_MS);

    private async getConnectionUri(dbmsId: string): Promise<string> {
        const neo4jConfig = await this.getDbmsConfig(dbmsId);
        // @todo: verify these settings with driver team
        const tlsLevel = neo4jConfig.get('dbms.connector.bolt.tls_level') || DBMS_TLS_LEVEL.DISABLED;
        const secure = tlsLevel !== DBMS_TLS_LEVEL.DISABLED;
        const protocol = secure ? 'neo4j+s://' : 'neo4j://';
        const host = neo4jConfig.get('dbms.default_advertised_address') || LOCALHOST_IP_ADDRESS;
        const port = neo4jConfig.get('dbms.connector.bolt.listen_address') || BOLT_DEFAULT_PORT;

        return `${protocol}${host}${port}`;
    }

    private async discoverDbmss(): Promise<void> {
        const dbmss: {[key: string]: IDbms} = {};
        const root = this.getDbmsRootPath();
        const files = await List.from(await fse.readdir(root))
            .filter((file) => file.startsWith(`${ENTITY_TYPES.DBMS}-`))
            .mapEach((file) =>
                fse
                    .stat(path.join(root, file))
                    .then((stats) => (stats.isDirectory() ? file : null))
                    .catch(() => null),
            )
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
                    const secure = tlsLevel !== DBMS_TLS_LEVEL.DISABLED;

                    const configDbmss = await this.manifest.get(id);
                    const overrides = {
                        config: neo4jConfig,
                        connectionUri: await this.getConnectionUri(id),
                        id,
                        rootPath: fullPath,
                        secure,
                    };

                    dbmss[id] = {
                        ...configDbmss,
                        ...overrides,
                    };
                }
            })
            .unwindPromises();

        // Set the new values all at once to prevent race conditions in case
        // we're reading this value while we're scanning for DBMSs.
        this.dbmss = dbmss;
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
}
