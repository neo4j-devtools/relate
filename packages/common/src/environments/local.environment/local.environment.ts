import {exec} from 'child_process';
import fse from 'fs-extra';
import {v4 as uuidv4} from 'uuid';
import {coerce, satisfies} from 'semver';
import path from 'path';
import * as rxjs from 'rxjs/operators';
import {Driver, DRIVER_RESULT_TYPE, IAuthToken, Result} from '@huboneo/tapestry';
import {promisify} from 'util';
import {List, None, Maybe, Str, Dict} from '@relate/types';

import {IDbms, EnvironmentConfigModel, IDbmsVersion, IDbmsInfo, IEnvironmentConfig} from '../../models';
import {EnvironmentAbstract} from '../environment.abstract';
import {PropertiesFile, ensureDirs} from '../../system/files';
import {
    AmbiguousTargetError,
    DbmsExistsError,
    InvalidArgumentError,
    NotAllowedError,
    NotSupportedError,
    NotFoundError,
    InvalidConfigError,
    ExtensionExistsError,
} from '../../errors';
import {
    DEFAULT_NEO4J_BOLT_PORT,
    LOCALHOST_IP_ADDRESS,
    NEO4J_CONF_DIR,
    NEO4J_CONF_FILE,
    NEO4J_CONF_FILE_BACKUP,
    NEO4J_CONFIG_KEYS,
    NEO4J_EDITION,
    NEO4J_SUPPORTED_VERSION_RANGE,
    ENVIRONMENTS_DIR_NAME,
    NEO4J_JWT_ADDON_NAME,
    NEO4J_JWT_ADDON_VERSION,
    NEO4J_PLUGIN_DIR,
    NEO4J_CERT_DIR,
    NEO4J_JWT_CONF_FILE,
} from '../environment.constants';
import {
    BOLT_DEFAULT_PORT,
    DBMS_DIR_NAME,
    DBMS_TLS_LEVEL,
    EXTENSION_DIR_NAME,
    EXTENSION_TYPES,
    JSON_FILE_EXTENSION,
    DBMS_STATUS_FILTERS,
    DBMS_STATUS,
    HOOK_EVENTS,
} from '../../constants';
import {envPaths, parseNeo4jConfigPort, emitHookEvent} from '../../utils';
import {isValidUrl} from '../../utils/generic';
import {
    getAppBasePath,
    discoverExtension,
    IExtensionMeta,
    discoverExtensionDistributions,
    extractExtension,
    extractNeo4j,
    downloadExtension,
    resolveDbms,
    elevatedNeo4jWindowsCmd,
    neo4jCmd,
    neo4jAdminCmd,
    fetchNeo4jVersions,
    generatePluginCerts,
    downloadNeo4j,
    discoverNeo4jDistributions,
    getDistributionInfo,
    IExtensionVersion,
    fetchExtensionVersions,
} from '../../utils/environment';

export class LocalEnvironment extends EnvironmentAbstract {
    private dbmss: {[id: string]: IDbms} = {};

    private readonly dirPaths = {
        ...envPaths(),
        dbmssCache: path.join(envPaths().cache, DBMS_DIR_NAME),
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
        extensionsCache: path.join(envPaths().cache, EXTENSION_DIR_NAME),
        extensionsData: path.join(envPaths().data, EXTENSION_DIR_NAME),
    };

    public get id(): string {
        return this.config.id;
    }

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await this.discoverDbmss();

        // @todo: this needs to be done proper
        const securityPluginFilename = `${NEO4J_JWT_ADDON_NAME}-${NEO4J_JWT_ADDON_VERSION}.jar`;
        const securityPluginTmp = path.join(__dirname, '..', '..', '..', securityPluginFilename);
        const securityPluginCache = path.join(this.dirPaths.cache, securityPluginFilename);
        const pluginInCache = await fse.pathExists(securityPluginCache);

        if (!pluginInCache) {
            await fse.copy(securityPluginTmp, securityPluginCache);
        }
    }

    async listDbmsVersions(): Promise<List<IDbmsVersion>> {
        const cached = await discoverNeo4jDistributions(this.dirPaths.dbmssCache);
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

    async installDbms(name: string, credentials: string, version: string): Promise<string> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        let dbmsExists;
        try {
            await this.getDbms(name);
            dbmsExists = true;
        } catch {
            dbmsExists = false;
        }

        if (dbmsExists) {
            throw new DbmsExistsError(`DBMS with name "${name}" already exists`);
        }

        // version as a file path.
        if ((await fse.pathExists(version)) && (await fse.stat(version)).isFile()) {
            const {extractedDistPath} = await extractNeo4j(version, this.dirPaths.dbmssCache);
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

            const beforeDownload = await discoverNeo4jDistributions(this.dirPaths.dbmssCache);
            const requestedDistribution = beforeDownload.find(
                (dist) => dist.edition === NEO4J_EDITION.ENTERPRISE && dist.version === coercedVersion,
            );

            const found = await requestedDistribution.flatMap(async (dist) => {
                if (None.isNone(dist)) {
                    await downloadNeo4j(coercedVersion, this.dirPaths.dbmssCache);
                    const afterDownload = await discoverNeo4jDistributions(this.dirPaths.dbmssCache);

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

    async uninstallDbms(nameOrId: string): Promise<void> {
        const {id} = resolveDbms(this.dbmss, nameOrId);
        const status = Str.from(await neo4jCmd(this.getDbmsRootPath(id), 'status'));

        if (!status.includes('Neo4j is not running')) {
            throw new NotAllowedError('Cannot uninstall DBMS that is not stopped');
        }

        return this.uninstallNeo4j(id);
    }

    startDbmss(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId).id)
            .mapEach((id) => neo4jCmd(this.getDbmsRootPath(id), 'start'))
            .unwindPromises();
    }

    stopDbmss(nameOrIds: string[] | List<string>): Promise<List<string>> {
        return List.from(nameOrIds)
            .mapEach((nameOrId) => resolveDbms(this.dbmss, nameOrId).id)
            .mapEach((id) => neo4jCmd(this.getDbmsRootPath(id), 'stop'))
            .unwindPromises();
    }

    async infoDbmss(nameOrIds: string[] | List<string>): Promise<List<IDbmsInfo>> {
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

    async updateDbmsConfig(nameOrId: string, properties: Map<string, string>): Promise<boolean> {
        const dbmsId = resolveDbms(this.dbmss, nameOrId).id;
        const neo4jConfig = await PropertiesFile.readFile(
            path.join(this.getDbmsRootPath(dbmsId), NEO4J_CONF_DIR, NEO4J_CONF_FILE),
        );

        properties.forEach((value, key) => neo4jConfig.set(key, value));

        await neo4jConfig.flush();

        return true;
    }

    async listDbmss(): Promise<List<IDbms>> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.discoverDbmss();

        return Dict.from(this.dbmss).values;
    }

    async getDbms(nameOrId: string): Promise<IDbms> {
        // Discover DBMSs again in case there have been changes in the file system.
        await this.discoverDbmss();

        return resolveDbms(this.dbmss, nameOrId);
    }

    async createAccessToken(appId: string, dbmsNameOrId: string, authToken: IAuthToken): Promise<string> {
        const dbmsRootPath = this.getDbmsRootPath(resolveDbms(this.dbmss, dbmsNameOrId).id);
        const config = await PropertiesFile.readFile(path.join(dbmsRootPath, NEO4J_CONF_DIR, NEO4J_CONF_FILE));
        const host = config.get(NEO4J_CONFIG_KEYS.DEFAULT_LISTEN_ADDRESS) || LOCALHOST_IP_ADDRESS;
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
        const dbmssDir = path.join(this.config.neo4jDataPath || this.dirPaths.data, DBMS_DIR_NAME);

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
        await this.updateEnvironmentDbmsConfig(dbmsId, {name});

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

        return fse.remove(dbmsDir).then(() => this.deleteEnvironmentDbmsConfig(dbmsId));
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

    private async updateEnvironmentDbmsConfig(uuid: string, update: Partial<Omit<IDbms, 'id'>>): Promise<void> {
        const environmentConfig = JSON.parse(
            await fse.readFile(
                path.join(this.dirPaths.environmentsConfig, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );
        environmentConfig.dbmss = {
            ...environmentConfig.dbmss,
            [uuid]: {
                ...update,
                id: uuid,
            },
        };
        await fse.writeJson(
            path.join(this.dirPaths.environmentsConfig, `${this.config.id}${JSON_FILE_EXTENSION}`),
            environmentConfig,
        );

        this.config = new EnvironmentConfigModel({
            ...this.config,
            dbmss: environmentConfig.dbmss,
        });

        await this.discoverDbmss();
    }

    private async deleteEnvironmentDbmsConfig(uuid: string): Promise<void> {
        const environmentConfig: IEnvironmentConfig = JSON.parse(
            await fse.readFile(
                path.join(this.dirPaths.environmentsConfig, `${this.config.id}${JSON_FILE_EXTENSION}`),
                'utf8',
            ),
        );

        environmentConfig.dbmss = Dict.from(environmentConfig.dbmss)
            .omit(uuid)
            .toObject();

        await fse.writeJson(
            path.join(this.dirPaths.environmentsConfig, `${this.config.id}${JSON_FILE_EXTENSION}`),
            environmentConfig,
        );

        this.config = new EnvironmentConfigModel({
            ...this.config,
            dbmss: environmentConfig.dbmss,
        });

        await this.discoverDbmss();
    }

    private async discoverDbmss(): Promise<void> {
        this.dbmss = {};

        const root = this.getDbmsRootPath();
        const fileNames = List.from(await fse.readdir(root));
        const configDbmss = Dict.from(this.config.dbmss);

        await fileNames
            .mapEach(async (fileName) => {
                const fullPath = path.join(root, fileName);
                const confPath = path.join(fullPath, NEO4J_CONF_DIR, NEO4J_CONF_FILE);
                const hasConf = await fse.pathExists(confPath);

                if (hasConf && fileName.startsWith('dbms-')) {
                    const id = fileName.replace('dbms-', '');
                    const config = await PropertiesFile.readFile(confPath);
                    // @todo: verify these settings with driver team
                    const tlsLevel = config.get('dbms.connector.bolt.tls_level') || DBMS_TLS_LEVEL.DISABLED;
                    const protocol = tlsLevel !== DBMS_TLS_LEVEL.DISABLED ? 'neo4j+s://' : 'neo4j://';
                    const host = config.get('dbms.default_advertised_address') || LOCALHOST_IP_ADDRESS;
                    const port = config.get('dbms.connector.bolt.listen_address') || BOLT_DEFAULT_PORT;
                    const defaultValues = {
                        description: '',
                        name: '',
                    };

                    this.dbmss[id] = configDbmss
                        .getValue(id)
                        .flatMap((val) => {
                            const defaults = Dict.from(defaultValues);
                            const overrides = {
                                config,
                                connectionUri: `${protocol}${host}${port}`,
                                id,
                                rootPath: fullPath,
                            };

                            if (None.isNone(val)) {
                                return defaults.merge(overrides);
                            }

                            return defaults.merge(val).merge(overrides);
                        })
                        .toObject();
                }
            })
            .unwindPromises();
    }

    async getAppPath(appName: string, appRoot = ''): Promise<string> {
        const appBase = await getAppBasePath(appName);

        return `${appRoot}${appBase}`;
    }

    async listInstalledApps(): Promise<List<IExtensionMeta>> {
        const allInstalled = List.from(await this.listInstalledExtensions());

        return allInstalled.filter(({type}) => type === EXTENSION_TYPES.STATIC);
    }

    async listInstalledExtensions(): Promise<List<IExtensionMeta>> {
        const allInstalledExtensions = await Dict.from(EXTENSION_TYPES)
            .values.mapEach((type) => discoverExtensionDistributions(path.join(this.dirPaths.extensionsData, type)))
            .unwindPromises();

        return allInstalledExtensions.flatten();
    }

    async linkExtension(filePath: string): Promise<IExtensionMeta> {
        const extension = await discoverExtension(filePath);
        const target = path.join(this.dirPaths.extensionsData, extension.type, extension.name);

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.symlink(filePath, target);

        return extension;
    }

    async installExtension(name: string, version: string): Promise<IExtensionMeta> {
        if (!version) {
            throw new InvalidArgumentError('Version must be specified');
        }

        const {extensionsCache, extensionsData} = this.dirPaths;

        // version as a file path.
        if ((await fse.pathExists(version)) && (await fse.stat(version)).isFile()) {
            // extract extension to cache dir first
            const {name: extensionName, dist, version: extensionVersion} = await extractExtension(
                version,
                extensionsCache,
            );

            // move the extracted dir
            const destination = path.join(extensionsCache, `${extensionName}@${extensionVersion}`);

            await fse.move(dist, destination, {
                overwrite: true,
            });

            try {
                const discovered = await discoverExtension(destination);

                return this.installRelateExtension(discovered, extensionsData, discovered.dist);
            } catch (e) {
                throw new NotFoundError(`Unable to find the requested version: ${version}`);
            }
        }

        // @todo: version as a URL.
        if (isValidUrl(version)) {
            throw new NotSupportedError(`fetch and install extension ${name}@${version}`);
        }

        const coercedVersion = coerce(version)?.version;
        if (coercedVersion) {
            const dists = List.from(await discoverExtensionDistributions(extensionsCache));
            const requestedDistribution = await dists
                .find((dist) => dist.name === name && dist.version === coercedVersion)
                .flatMap(async (requested) => {
                    if (None.isNone(requested)) {
                        try {
                            return downloadExtension(name, coercedVersion, extensionsCache);
                        } catch (e) {
                            throw new NotFoundError(`Unable to find the requested version: ${version} online`);
                        }
                    }

                    return requested;
                });

            return this.installRelateExtension(requestedDistribution, extensionsData, requestedDistribution.dist);
        }

        throw new InvalidArgumentError('Provided version argument is not valid semver, url or path.');
    }

    private async installRelateExtension(
        extension: IExtensionMeta,
        extensionsDir: string,
        extractedDistPath: string,
    ): Promise<IExtensionMeta> {
        const target = path.join(extensionsDir, extension.type, extension.name);

        if (!(await fse.pathExists(extractedDistPath))) {
            throw new AmbiguousTargetError(`Path to extension does not exist "${extractedDistPath}"`);
        }

        if (await fse.pathExists(target)) {
            throw new ExtensionExistsError(`${extension.name} is already installed`);
        }

        await fse.copy(extractedDistPath, target);

        // @todo: need to look at our use of exec (and maybe child processes) in general
        // this does not account for all scenarios at the moment so needs more thought
        const execute = promisify(exec);

        try {
            await emitHookEvent(
                HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_START,
                `installing dependencies for ${extension.name}`,
            );
            const output = await execute('npm install --production', {
                cwd: target,
            });
            await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP, output);
        } catch (err) {
            throw new Error(err);
        }

        return extension;
    }

    async uninstallExtension(name: string): Promise<List<IExtensionMeta>> {
        // @todo: this is uninstalling only static extensions
        const installedExtensions = await this.listInstalledApps();
        // @todo: if more than one version installed, would need to filter version too
        const targets = installedExtensions.filter((ext) => ext.name === name);

        if (targets.isEmpty) {
            throw new InvalidArgumentError(`Extension ${name} is not installed`);
        }

        return targets
            .mapEach(async (ext) => {
                await fse.remove(ext.dist);

                return ext;
            })
            .unwindPromises();
    }

    listExtensionVersions(): Promise<List<IExtensionVersion>> {
        return fetchExtensionVersions();
    }
}
