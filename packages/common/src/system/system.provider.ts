import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import fse from 'fs-extra';
import _ from 'lodash';

import {
    DEFAULT_ENVIRONMENT_NAME,
    JSON_FILE_EXTENSION,
    JWT_INSTANCE_TOKEN_SALT,
    DBMS_DIR_NAME,
    RELATE_KNOWN_CONNECTIONS_FILE,
} from '../constants';
import {EnvironmentAbstract, ENVIRONMENTS_DIR_NAME, createEnvironmentInstance} from '../environments';
import {NotFoundError, ValidationFailureError, TargetExistsError} from '../errors';
import {EnvironmentConfigModel, AppLaunchTokenModel, IAppLaunchToken} from '../models';
import {envPaths, getSystemAccessToken, registerSystemAccessToken} from '../utils';
import {ensureDirs, ensureFiles} from './files';
import {IEnvironmentConfig} from '../models/environment-config.model';
import {TokenService} from '../token.service';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly dirPaths = {
        ...envPaths(),
        dbmssCache: path.join(envPaths().cache, DBMS_DIR_NAME),
        dbmssData: path.join(envPaths().data, DBMS_DIR_NAME),
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    protected readonly filePaths = {
        knownConnections: path.join(envPaths().data, RELATE_KNOWN_CONNECTIONS_FILE),
    };

    protected readonly allEnvironments: Map<string, EnvironmentAbstract> = new Map<string, EnvironmentAbstract>();

    async onModuleInit(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await ensureFiles(this.filePaths);
        await this.discoverEnvironments();
    }

    async getEnvironment(uuid?: string): Promise<EnvironmentAbstract> {
        await this.discoverEnvironments();

        const environment = this.allEnvironments.get(uuid ? uuid : DEFAULT_ENVIRONMENT_NAME);

        if (!environment) {
            throw new NotFoundError(`Environment "${uuid}" not found`);
        }

        return environment;
    }

    async registerAccessToken(
        environmentId: string,
        dbmsId: string,
        dbmsUser: string,
        accessToken: string,
    ): Promise<string> {
        await registerSystemAccessToken(this.filePaths.knownConnections, environmentId, dbmsId, dbmsUser, accessToken);

        return accessToken;
    }

    async getAccessToken(environmentId: string, dbmsId: string, dbmsUser: string): Promise<string> {
        const environment = await this.getEnvironment(environmentId);
        const dbms = await environment.getDbms(dbmsId);
        const token = await getSystemAccessToken(this.filePaths.knownConnections, environment.id, dbms.id, dbmsUser);

        if (!token) {
            throw new NotFoundError(`No Access Token found for user "${dbmsUser}"`);
        }

        return token;
    }

    async createEnvironment(config: IEnvironmentConfig): Promise<EnvironmentAbstract> {
        const fileName = `${config.id}${JSON_FILE_EXTENSION}`;
        const filePath = path.join(this.dirPaths.environmentsConfig, fileName);

        const environmentExists = await fse.pathExists(filePath);
        if (environmentExists || this.allEnvironments.get(config.id)) {
            throw new TargetExistsError(`Environment "${DEFAULT_ENVIRONMENT_NAME}" exists, will not overwrite`);
        }

        const configModel = new EnvironmentConfigModel(config);
        const environment = await createEnvironmentInstance(configModel, filePath);

        await fse.writeJSON(filePath, config, {spaces: 2});
        this.allEnvironments.set(environment.id, environment);

        return environment;
    }

    private async discoverEnvironments(): Promise<void> {
        this.allEnvironments.clear();
        const environmentsDir = this.dirPaths.environmentsConfig;
        const availableFiles = await fse.readdir(environmentsDir);
        const availableEnvironments = _.filter(
            availableFiles,
            (environment) => path.extname(environment).toLocaleLowerCase() === JSON_FILE_EXTENSION,
        );

        await Promise.all(
            _.map(availableEnvironments, async (envFilename) => {
                const configPath = path.join(environmentsDir, envFilename);
                const config = await fse.readJSON(configPath);
                const environmentConfig: EnvironmentConfigModel = new EnvironmentConfigModel({
                    ...config,
                    id: path.basename(envFilename, JSON_FILE_EXTENSION),
                    neo4jDataPath: config.neo4jDataPath || this.dirPaths.data,
                });

                this.allEnvironments.set(
                    `${environmentConfig.id}`,
                    await createEnvironmentInstance(environmentConfig, configPath),
                );
            }),
        );
    }

    createAppLaunchToken(
        environmentId: string,
        appId: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
    ): Promise<string> {
        const validated = JSON.parse(
            JSON.stringify(
                new AppLaunchTokenModel({
                    accessToken,
                    appId,
                    dbmsId,
                    environmentId,
                    principal,
                }),
            ),
        );

        return TokenService.sign(validated, appId);
    }

    parseAppLaunchToken(appId: string, launchToken: string): Promise<IAppLaunchToken> {
        return TokenService.verify(launchToken, appId)
            .then((decoded: any) => {
                if (decoded.appId !== appId) {
                    throw new ValidationFailureError('App Launch Token mismatch');
                }

                return new AppLaunchTokenModel({
                    accessToken: decoded.accessToken,
                    appId: decoded.appId,
                    dbmsId: decoded.dbmsId,
                    environmentId: decoded.environmentId,
                    principal: decoded.principal,
                });
            })
            .catch((e) => {
                if (e instanceof ValidationFailureError) {
                    throw e;
                }

                throw new ValidationFailureError('Invalid App Launch Token');
            });
    }
}
