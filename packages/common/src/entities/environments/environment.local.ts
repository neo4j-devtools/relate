import fse from 'fs-extra';
import path from 'path';

import {LocalDbmss} from '../dbmss';
import {EnvironmentAbstract} from './environment.abstract';
import {envPaths} from '../../utils';
import {ensureDirs} from '../../system/files';
import {ENVIRONMENTS_DIR_NAME} from './environment.constants';
import {
    BACKUPS_DIR_NAME,
    DBMS_DIR_NAME,
    ENTITY_TYPES,
    EXTENSION_DIR_NAME,
    EXTENSION_TYPES,
    PLUGIN_SOURCES_DIR_NAME,
    PLUGIN_VERSIONS_DIR_NAME,
    PROJECTS_DIR_NAME,
    UPGRADE_LOGS_DIR_NAME,
} from '../../constants';
import {LocalProjects} from '../projects';
import {LocalDbs} from '../dbs';
import {LocalBackups} from '../backups';
import {LocalDbmsPlugins} from '../dbms-plugins';
import {InvalidArgumentError} from '../../errors';
import {TokenService} from '../../token.service';
import {getManifestName} from '../../utils/system';

export class LocalEnvironment extends EnvironmentAbstract {
    public readonly dbmss = new LocalDbmss(this);

    public readonly dbmsPlugins = new LocalDbmsPlugins(this);

    public readonly dbs = new LocalDbs(this);

    public readonly projects = new LocalProjects(this);

    public readonly backups = new LocalBackups(this);

    public readonly dirPaths = {
        ...envPaths(),
        dbmssData: path.join(this.dataPath, DBMS_DIR_NAME),
        backupsData: path.join(this.dataPath, BACKUPS_DIR_NAME),
        upgradeLogsData: path.join(this.dataPath, UPGRADE_LOGS_DIR_NAME),
        projectsData: path.join(this.dataPath, PROJECTS_DIR_NAME),
        dbmssCache: path.join(this.cachePath, DBMS_DIR_NAME),
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
        extensionsCache: path.join(this.cachePath, EXTENSION_DIR_NAME),
        extensionsData: path.join(this.dataPath, EXTENSION_DIR_NAME),
        staticExtensionsData: path.join(this.dataPath, EXTENSION_DIR_NAME, EXTENSION_TYPES.STATIC),
        pluginSources: path.join(this.dataPath, PLUGIN_SOURCES_DIR_NAME),
        pluginVersions: path.join(this.dataPath, PLUGIN_VERSIONS_DIR_NAME),
    };

    public getEntityRootPath(entityType: ENTITY_TYPES, id: string): string {
        switch (entityType) {
            case ENTITY_TYPES.BACKUP:
                return path.join(this.dirPaths.backupsData, `${ENTITY_TYPES.BACKUP}-${id}`);

            case ENTITY_TYPES.DBMS:
                return path.join(this.dirPaths.dbmssData, `${ENTITY_TYPES.DBMS}-${id}`);

            case ENTITY_TYPES.PROJECT:
                return path.join(this.dirPaths.projectsData, `${ENTITY_TYPES.PROJECT}-${id}`);

            case ENTITY_TYPES.PROJECT_INSTALL:
                return path.join(this.dirPaths.projectsData, `${ENTITY_TYPES.PROJECT}-${id}`);

            case ENTITY_TYPES.EXTENSION:
                return path.join(this.dirPaths.extensionsData, `${ENTITY_TYPES.EXTENSION}-${id}`);

            case ENTITY_TYPES.ENVIRONMENT:
                return path.join(this.dirPaths.environmentsConfig, `${id}`);

            case ENTITY_TYPES.DB:
            default:
                throw new InvalidArgumentError(`Entity type ${entityType} is not stored on disk`);
        }
    }

    public entityExists(entityType: ENTITY_TYPES, id: string): Promise<boolean> {
        // Need to check for the manifest instead of the project path, as broken
        // links return inconsistent results across platforms (they behave as
        // existing on Windows and non existing on Mac and Linux).
        const manifestPath = path.join(this.getEntityRootPath(entityType, id), getManifestName(entityType));
        return fse.pathExists(manifestPath);
    }

    async init(): Promise<void> {
        await ensureDirs(this.dirPaths);
    }

    generateAPIToken(hostName: string, clientId: string, data: any = {}): Promise<string> {
        return TokenService.sign(data, `${hostName}-${clientId}`);
    }

    async verifyAPIToken(hostName: string, clientId: string, token = ''): Promise<void> {
        await TokenService.verify(token, `${hostName}-${clientId}`);
    }
}
