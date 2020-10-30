import {Dict, List, Maybe, None, Str} from '@relate/types';
import fse from 'fs-extra';
import semver, {coerce, satisfies} from 'semver';
import path from 'path';
import {IAuthToken} from '@huboneo/tapestry';
import * as rxjs from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';
import {throttle} from 'lodash';

import {DbmssAbstract} from './dbmss.abstract';
import {IDbms, IDbmsManifest, IDbmsInfo, IDbmsVersion, DbmsManifestModel} from '../../models';
import {
    dbmsUpgradeConfigs,
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
    waitForDbmsToBeOnline,
} from '../../utils/dbmss';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    DbmsUpgradeError,
    InvalidArgumentError,
    NotAllowedError,
    NotFoundError,
    NotSupportedError,
    RelateBackupError,
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
    NEO4J_JWT_ADDON_VERSION,
    NEO4J_JWT_CONF_FILE,
    NEO4J_PLUGIN_DIR,
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
    HOOK_EVENTS,
} from '../../constants';
import {PropertiesFile} from '../../system/files';
import {winNeo4jStart, winNeo4jStatus, winNeo4jStop} from '../../utils/dbmss/neo4j-process-win';
import {emitHookEvent} from '../../utils';

export class LocalDbmss extends DbmssAbstract<LocalEnvironment> {
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

    async upgrade(
        dbmsId: string,
        version: string,
        migrate = true,
        backup?: boolean,
        noCache?: boolean,
    ): Promise<IDbmsInfo> {
        if (!semver.satisfies(version, NEO4J_SUPPORTED_VERSION_RANGE)) {
            throw new InvalidArgumentError(`Version not in range ${NEO4J_SUPPORTED_VERSION_RANGE}`, [
                'Use valid version',
            ]);
        }

        const dbms = await this.get(dbmsId);
        const dbmsManifest = await this.getDbmsManifest(dbmsId);

        if (semver.lte(version, dbms.version!)) {
            throw new InvalidArgumentError(`Target version must be greater than ${dbms.version}`, [
                'Use valid version',
            ]);
        }

        if (dbms.status !== DBMS_STATUS.STOPPED) {
            throw new InvalidArgumentError(`Can only upgrade stopped dbms`, ['Stop dbms']);
        }

        const {entityType, entityId} = await emitHookEvent(HOOK_EVENTS.BACKUP_START, {
            entityType: ENTITY_TYPES.DBMS,
            entityId: dbms.id,
        });
        const dbmsBackup = await this.environment.backups.create(entityType, entityId);
        const {backup: completeBackup} = await emitHookEvent(HOOK_EVENTS.BACKUP_COMPLETE, {backup: dbmsBackup});

        const upgradeTmpName = `[Upgrade ${version}] ${dbms.name}`;

        try {
            const upgradedDbmsInfo = await this.install(upgradeTmpName, version, dbms.edition!, '', noCache);
            const upgradedConfigFileName = path.join(
                this.getDbmsRootPath(upgradedDbmsInfo.id),
                NEO4J_CONF_DIR,
                NEO4J_CONF_FILE,
            );

            await dbmsUpgradeConfigs(dbms, upgradedDbmsInfo, upgradedConfigFileName);

            const upgradedConfig = await this.getDbmsConfig(upgradedDbmsInfo.id);

            /**
             * Run Neo4j migration?
             */
            if (migrate) {
                upgradedConfig.set('dbms.allow_upgrade', 'true');
                await upgradedConfig.flush();
                const upgradedDbms = resolveDbms(this.dbmss, upgradedDbmsInfo.id);

                await emitHookEvent(HOOK_EVENTS.DBMS_MIGRATION_START, {dbms: upgradedDbms});

                await this.start([upgradedDbms.id]);
                await waitForDbmsToBeOnline(upgradedDbms);
                await this.stop([upgradedDbms.id]);

                await emitHookEvent(HOOK_EVENTS.DBMS_MIGRATION_STOP, {dbms: upgradedDbms});

                await upgradedConfig.flush();
            } else {
                upgradedConfig.set('dbms.allow_upgrade', 'false');
                await upgradedConfig.flush();
            }

            /**
             * Replace old installation
             */
            await this.uninstall(dbms.id);
            await fse.move(upgradedDbmsInfo.rootPath!, dbms.rootPath!);
            await this.updateDbmsManifest(dbms.id, {
                ...dbmsManifest,
                name: dbms.name,
            });

            if (!backup) {
                await this.environment.backups.remove(completeBackup.id);
            }

            return this.get(dbms.id);
        } catch (e) {
            if (e instanceof RelateBackupError) {
                throw e;
            }

            await this.get(upgradeTmpName)
                .then(({id}) => this.uninstallNeo4j(id))
                .catch(() => null);
            await this.uninstallNeo4j(dbms.id).catch(() => null);

            const restored = await this.environment.backups.restore(completeBackup.directory);

            await fse.move(this.getDbmsRootPath(restored.entityId)!, dbms.rootPath!);
            await this.updateDbmsManifest(dbms.id, {
                name: dbms.name,
            });

            throw new DbmsUpgradeError(`Failed to upgrade dbms ${dbms.id}`, e.message, [
                `DBMS was restored from backup ${completeBackup.id}`,
            ]);
        }
    }

    async link(name: string, rootPath: string): Promise<IDbmsInfo> {
        const exists = await this.list([
            {
                field: 'name',
                value: name,
            },
        ]);

        if (!exists.isEmpty) {
            throw new InvalidArgumentError(`DBMS "${name}" already exists`, ['Use a unique name']);
        }

        const alreadyHasManifest = await fse.pathExists(path.join(rootPath, DBMS_MANIFEST_FILE));

        if (alreadyHasManifest) {
            const {id} = await fse.readJson(path.join(rootPath, DBMS_MANIFEST_FILE));
            const target = this.environment.getEntityRootPath(ENTITY_TYPES.DBMS, id);
            const targetExists = await fse.pathExists(target);

            if (targetExists) {
                throw new InvalidArgumentError(`DBMS "${name}" already managed by relate`);
            }

            await fse.symlink(rootPath, target, 'junction');

            return this.get(id);
        }

        const newId = uuidv4();
        const info = await getDistributionInfo(rootPath);

        if (!info || !semver.satisfies(info.version, NEO4J_SUPPORTED_VERSION_RANGE)) {
            throw new InvalidArgumentError(`Path "${rootPath}" does not seem to be a valid neo4j DBMS`, [
                'Use a valid path',
            ]);
        }

        const target = this.environment.getEntityRootPath(ENTITY_TYPES.DBMS, newId);

        await fse.symlink(rootPath, target, 'junction');
        await this.updateDbmsManifest(newId, {name});

        if (supportsAccessTokens(info)) {
            await this.installSecurityPlugin(newId);
        }

        await this.discoverDbmss();

        return this.get(newId);
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
        await this.updateDbmsManifest(clonedId, {
            name,
        });

        return this.get(clonedId);
    }

    async uninstall(nameOrId: string): Promise<IDbmsInfo> {
        const {id} = resolveDbms(this.dbmss, nameOrId);
        const status = Str.from(await neo4jCmd(this.getDbmsRootPath(id), 'status'));

        if (status.includes(DBMS_STATUS_FILTERS.STARTED)) {
            throw new NotAllowedError('Cannot uninstall DBMS that is running');
        }

        return this.uninstallNeo4j(id);
    }

    start(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId).id)
            .mapEach((id) => {
                if (process.platform === 'win32') {
                    return winNeo4jStart(this.getDbmsRootPath(id));
                }

                return neo4jCmd(this.getDbmsRootPath(id), 'start');
            })
            .unwindPromises();
    }

    stop(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId).id)
            .mapEach((id) => {
                if (process.platform === 'win32') {
                    return winNeo4jStop(this.getDbmsRootPath(id));
                }

                return neo4jCmd(this.getDbmsRootPath(id), 'stop');
            })
            .unwindPromises();
    }

    info(nameOrIds: string[] | List<string>, onlineCheck?: boolean): Promise<List<IDbmsInfo>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId))
            .mapEach(async (dbms) => {
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
                    serverStatus = (await isDbmsOnline(dbms)) ? DBMS_SERVER_STATUS.ONLINE : DBMS_SERVER_STATUS.OFFLINE;
                }

                return {
                    connectionUri: dbms.connectionUri,
                    description: dbms.description,
                    edition: v?.edition,
                    id: dbms.id,
                    name: dbms.name,
                    rootPath: dbms.rootPath,
                    tags: dbms.tags,
                    status,
                    serverStatus,
                    version: v?.version,
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

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IDbms>> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.throttledDiscoverDbmss();

        return applyEntityFilters(Dict.from(this.dbmss).values, filters);
    }

    async get(nameOrId: string, onlineCheck?: boolean): Promise<IDbmsInfo> {
        await this.discoverDbmss();

        try {
            const info = await this.info([nameOrId], onlineCheck);

            return info.first.getOrElse(() => {
                throw new InvalidArgumentError(`DBMS "${nameOrId}" not found`);
            });
        } catch (e) {
            throw new InvalidArgumentError(`DBMS "${nameOrId}" not found`);
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
            await this.updateDbmsManifest(dbmsId, {name});

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
        const pKeyPassword = uuidv4();
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
        const {publicKey, privateKey} = generatePluginCerts(pKeyPassword);

        await fse.copy(pluginSource, pluginTarget);
        await fse.writeFile(publicKeyTarget, publicKey, 'utf8');
        await fse.writeFile(privateKeyTarget, privateKey, 'utf8');

        const neo4jConfig = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );
        const authenticationProviders = Str.from(neo4jConfig.get('dbms.security.authentication_providers') || 'native')
            .split(',')
            .filter((_) => !_.isEmpty);
        const authorizationProviders = Str.from(neo4jConfig.get('dbms.security.authorization_providers') || 'native')
            .split(',')
            .filter((_) => !_.isEmpty);
        const unrestrictedProcedures = Str.from(neo4jConfig.get('dbms.security.procedures.unrestricted') || '')
            .split(',')
            .filter((_) => !_.isEmpty);

        neo4jConfig.set(
            `dbms.security.authentication_providers`,
            authenticationProviders
                .concat([`plugin-com.neo4j.plugin.jwt.auth.JwtAuthPlugin`])
                .join(',')
                .get(),
        );
        neo4jConfig.set(
            `dbms.security.authorization_providers`,
            authorizationProviders
                .concat([`plugin-com.neo4j.plugin.jwt.auth.JwtAuthPlugin`])
                .join(',')
                .get(),
        );
        neo4jConfig.set(
            `dbms.security.procedures.unrestricted`,
            unrestrictedProcedures
                .concat([`jwt.security.*`])
                .join(',')
                .get(),
        );

        await neo4jConfig.flush();

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

    private async discoverDbmss(): Promise<void> {
        const dbmss = {} as {[key: string]: IDbms};

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
                    const protocol = secure ? 'neo4j+s://' : 'neo4j://';
                    const host = neo4jConfig.get('dbms.default_advertised_address') || LOCALHOST_IP_ADDRESS;
                    const port = neo4jConfig.get('dbms.connector.bolt.listen_address') || BOLT_DEFAULT_PORT;
                    const configDbmss = await this.getDbmsManifest(id);
                    const overrides = {
                        config: neo4jConfig,
                        connectionUri: `${protocol}${host}${port}`,
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

    public async addTags(nameOrId: string, tags: string[]): Promise<IDbmsInfo> {
        const {id, tags: existing} = await this.get(nameOrId);

        await this.updateDbmsManifest(id, {
            tags: List.from(existing)
                .concat(tags)
                .unique()
                .toArray(),
        });

        return this.get(id);
    }

    public async removeTags(nameOrId: string, tags: string[]): Promise<IDbmsInfo> {
        const {id, tags: existing} = await this.get(nameOrId);

        await this.updateDbmsManifest(id, {
            tags: List.from(existing)
                .without(...tags)
                .toArray(),
        });

        return this.get(id);
    }

    public async getDbmsManifest(dbmsId: string): Promise<DbmsManifestModel> {
        const defaultValues = {
            description: '',
            name: '',
            tags: [],
        };

        const configFileName = path.join(
            this.environment.getEntityRootPath(ENTITY_TYPES.DBMS, dbmsId),
            DBMS_MANIFEST_FILE,
        );

        try {
            const config = await fse.readJson(configFileName);

            return new DbmsManifestModel({
                ...defaultValues,
                ...config,
                id: dbmsId,
            });
        } catch (e) {
            return new DbmsManifestModel({
                ...defaultValues,
                id: dbmsId,
            });
        }
    }

    public async updateDbmsManifest(dbmsId: string, update: Partial<Omit<IDbmsManifest, 'id'>>): Promise<void> {
        const configFileName = path.join(this.getDbmsRootPath(dbmsId), DBMS_MANIFEST_FILE);
        const config = Dict.from(await this.getDbmsManifest(dbmsId));
        const updated = config.merge(update).merge({
            id: dbmsId,
        });

        await fse.writeJson(configFileName, new DbmsManifestModel(updated.toObject()));

        return this.discoverDbmss();
    }
}
