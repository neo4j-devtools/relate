import fse from 'fs-extra';
import path from 'path';

import {LocalDbmss} from '../dbmss';
import {LocalExtensions} from '../extensions';
import {EnvironmentAbstract} from './environment.abstract';
import {envPaths} from '../../utils';
import {ensureDirs} from '../../system/files';
import {ENVIRONMENTS_DIR_NAME, NEO4J_JWT_ADDON_NAME, NEO4J_JWT_ADDON_VERSION} from './environment.constants';
import {DBMS_DIR_NAME, EXTENSION_DIR_NAME, PROJECTS_DIR_NAME} from '../../constants';
import {LocalProjects} from '../projects';
import {LocalDbs} from '../dbs';

export class LocalEnvironment extends EnvironmentAbstract {
    public readonly dbmss = new LocalDbmss(this);

    public readonly dbs = new LocalDbs(this);

    public readonly extensions = new LocalExtensions(this);

    public readonly projects = new LocalProjects(this);

    public readonly dirPaths = {
        ...envPaths(),
        dbmssData: path.join(this.config.neo4jDataPath || envPaths().data, DBMS_DIR_NAME),
        projectsData: path.join(this.config.neo4jDataPath || envPaths().data, PROJECTS_DIR_NAME),
        dbmssCache: path.join(envPaths().cache, DBMS_DIR_NAME),
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
        extensionsCache: path.join(envPaths().cache, EXTENSION_DIR_NAME),
        extensionsData: path.join(envPaths().data, EXTENSION_DIR_NAME),
    };

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
}
