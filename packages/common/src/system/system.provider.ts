import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import fse from 'fs-extra';
import {List, Dict, None, Maybe} from '@relate/types';

import {
    DEFAULT_ENVIRONMENT_NAME,
    JSON_FILE_EXTENSION,
    DBMS_DIR_NAME,
    RELATE_KNOWN_CONNECTIONS_FILE,
} from '../constants';
import {EnvironmentAbstract, ENVIRONMENTS_DIR_NAME} from '../entities/environments';
import {NotFoundError, ValidationFailureError, TargetExistsError} from '../errors';
import {EnvironmentConfigModel, AppLaunchTokenModel, IAppLaunchToken, IEnvironmentConfig} from '../models';
import {envPaths, getSystemAccessToken, registerSystemAccessToken} from '../utils';
import {createEnvironmentInstance} from '../utils/system';
import {ensureDirs, ensureFiles} from './files';
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
        await this.reloadEnvironments();
    }

    async useEnvironment(uuid: string): Promise<EnvironmentAbstract> {
        // Get the environment before modifying any config to make sure we don't
        // make any changes in case it doesn't exist.
        const defaultEnvironment = await this.getEnvironment(uuid);

        const environments = List.from(this.allEnvironments.values());
        await environments
            .mapEach(async (env) => {
                await env.updateConfig('active', env.id === uuid);
            })
            .unwindPromises();

        return defaultEnvironment;
    }

    async getEnvironment(uuid?: string): Promise<EnvironmentAbstract> {
        await this.reloadEnvironments();

        const environments = Dict.of(this.allEnvironments);

        if (uuid) {
            const environment: Maybe<EnvironmentAbstract> = environments.getValue(uuid);
            return environment.flatMap((env) => {
                if (None.isNone(env)) {
                    throw new NotFoundError(`Environment "${uuid}" not found`);
                }

                return env;
            });
        }

        const activeEnvironment = environments.values.find((env) => env.active);
        return activeEnvironment.flatMap((env) => {
            if (None.isNone(env)) {
                throw new NotFoundError(`No environment in use`);
            }

            return env;
        });
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
        const dbms = await environment.dbmss.get(dbmsId);
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

        const configModel = new EnvironmentConfigModel({
            ...config,
            configPath: filePath,
        });
        const environment = await createEnvironmentInstance(configModel);

        await fse.writeJSON(filePath, config, {spaces: 2});
        this.allEnvironments.set(environment.id, environment);

        return environment;
    }

    private async reloadEnvironments(): Promise<void> {
        const configs = await this.listEnvironments();

        await configs
            .mapEach(async (environmentConfig) => {
                this.allEnvironments.set(`${environmentConfig.id}`, await createEnvironmentInstance(environmentConfig));
            })
            .unwindPromises();
    }

    createAppLaunchToken(
        environmentId: string,
        appName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
    ): Promise<string> {
        const validated = JSON.parse(
            JSON.stringify(
                new AppLaunchTokenModel({
                    accessToken,
                    appName,
                    dbmsId,
                    environmentId,
                    principal,
                }),
            ),
        );

        return TokenService.sign(validated, appName);
    }

    parseAppLaunchToken(appName: string, launchToken: string): Promise<IAppLaunchToken> {
        return TokenService.verify(launchToken, appName)
            .then((decoded: any) => {
                if (decoded.appName !== appName) {
                    throw new ValidationFailureError('App Launch Token mismatch');
                }

                return new AppLaunchTokenModel({
                    accessToken: decoded.accessToken,
                    appName: decoded.appName,
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

    async listEnvironments(): Promise<List<EnvironmentConfigModel>> {
        const configs = await List.from(await fse.readdir(this.dirPaths.environmentsConfig))
            .filter((name) => name.endsWith('.json'))
            .mapEach((name) => {
                const configPath = path.join(this.dirPaths.environmentsConfig, name);

                return fse
                    .readJSON(configPath)
                    .then(
                        (config) =>
                            new EnvironmentConfigModel({
                                ...config,
                                configPath,
                                id: path.basename(name, JSON_FILE_EXTENSION),
                                neo4jDataPath: config.neo4jDataPath || this.dirPaths.data,
                            }),
                    )
                    .catch(() => None.EMPTY);
            })
            .unwindPromises();

        return configs.compact();
    }
}
