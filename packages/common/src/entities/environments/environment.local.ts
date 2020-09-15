import fse from 'fs-extra';
import path from 'path';

import {LocalDbmss} from '../dbmss';
import {LocalExtensions} from '../extensions';
import {EnvironmentAbstract} from './environment.abstract';
import {envPaths} from '../../utils';
import {ensureDirs} from '../../system/files';
import {ENVIRONMENTS_DIR_NAME, NEO4J_JWT_ADDON_NAME, NEO4J_JWT_ADDON_VERSION} from './environment.constants';
import {
    BACKUPS_DIR_NAME,
    DBMS_DIR_NAME,
    ENTITY_TYPES,
    EXTENSION_DIR_NAME,
    EXTENSION_TYPES,
    PROJECTS_DIR_NAME,
} from '../../constants';
import {LocalProjects} from '../projects';
import {LocalDbs} from '../dbs';
import {LocalBackups} from '../backups';
import {InvalidArgumentError} from '../../errors';
import {TokenService} from '../../token.service';

export class LocalEnvironment extends EnvironmentAbstract {
    public readonly dbmss = new LocalDbmss(this);

    public readonly dbs = new LocalDbs(this);

    public readonly extensions = new LocalExtensions(this);

    public readonly projects = new LocalProjects(this);

    public readonly backups = new LocalBackups(this);

    public readonly dirPaths = {
        ...envPaths(),
        dbmssData: path.join(this.dataPath, DBMS_DIR_NAME),
        backupsData: path.join(this.dataPath, BACKUPS_DIR_NAME),
        projectsData: path.join(this.dataPath, PROJECTS_DIR_NAME),
        dbmssCache: path.join(this.cachePath, DBMS_DIR_NAME),
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
        extensionsCache: path.join(this.cachePath, EXTENSION_DIR_NAME),
        extensionsData: path.join(this.dataPath, EXTENSION_DIR_NAME),
        staticExtensionsData: path.join(this.dataPath, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC),
    };

    public getEntityRootPath(entityType: ENTITY_TYPES, entityNameOrId: string): string {
        switch (entityType) {
            case ENTITY_TYPES.BACKUP:
                return path.join(this.dirPaths.backupsData, `${ENTITY_TYPES.BACKUP}-${entityNameOrId}`);

            case ENTITY_TYPES.DBMS:
                return path.join(this.dirPaths.dbmssData, `${ENTITY_TYPES.DBMS}-${entityNameOrId}`);

            case ENTITY_TYPES.PROJECT:
                return path.join(this.dirPaths.projectsData, `${ENTITY_TYPES.PROJECT}-${entityNameOrId}`);

            case ENTITY_TYPES.EXTENSION:
                return path.join(this.dirPaths.extensionsData, `${ENTITY_TYPES.EXTENSION}-${entityNameOrId}`);

            case ENTITY_TYPES.ENVIRONMENT:
                return path.join(this.dirPaths.environmentsConfig, `${entityNameOrId}`);

            case ENTITY_TYPES.DB:
            default:
                throw new InvalidArgumentError(`Entity type ${entityType} is not stored on disk`);
        }
    }

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);

        await this.dbmss.list();

        // @todo: this needs to be done proper
        const securityPluginFilename = `${NEO4J_JWT_ADDON_NAME}-${NEO4J_JWT_ADDON_VERSION}.jar`;
        const securityPluginTmp = path.join(__dirname, '..', '..', '..', securityPluginFilename);
        const securityPluginCache = path.join(this.dirPaths.cache, securityPluginFilename);
        const pluginInCache = await fse.pathExists(securityPluginCache);

        if (!pluginInCache) {
            await fse.copy(securityPluginTmp, securityPluginCache);
        }
    }

    generateAPIToken(hostName: string, clientId: string, data: any = {}): Promise<string> {
        return TokenService.sign(data, `${hostName}-${clientId}`);
    }

    async verifyAPIToken(hostName: string, clientId: string, token = ''): Promise<void> {
        await TokenService.verify(token, `${hostName}-${clientId}`);
    }
}
