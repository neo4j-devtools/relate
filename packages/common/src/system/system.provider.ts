import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import fse from 'fs-extra';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import {
    DEFAULT_ENVIRONMENT_NAME,
    JSON_FILE_EXTENSION,
    JWT_INSTANCE_TOKEN_SALT,
    DBMS_DIR_NAME,
    RELATE_KNOWN_CONNECTIONS_FILE,
    TWENTY_FOUR_HOURS_SECONDS,
} from '../constants';
import {
    ENVIRONMENT_TYPES,
    EnvironmentAbstract,
    ENVIRONMENTS_DIR_NAME,
    createEnvironmentInstance,
} from '../environments';
import {NotFoundError, ValidationFailureError, TargetExistsError} from '../errors';
import {EnvironmentConfigModel, AppLaunchTokenModel, IAppLaunchToken} from '../models';
import {envPaths, getSystemAccessToken, registerSystemAccessToken} from '../utils';
import {ensureDirs, ensureFiles} from '../system';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly dirPaths = {
        ...envPaths(),
        environments: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
        dbmss: path.join(envPaths().data, DBMS_DIR_NAME),
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
        const token = await getSystemAccessToken(this.filePaths.knownConnections, environmentId, dbmsId, dbmsUser);

        if (!token) {
            throw new NotFoundError(`No Access Token found for user "${dbmsUser}"`);
        }

        return token;
    }

    async initInstallation(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await ensureFiles(this.filePaths);
        const defaultEnvironmentPath = path.join(
            this.dirPaths.config,
            ENVIRONMENTS_DIR_NAME,
            DEFAULT_ENVIRONMENT_NAME + JSON_FILE_EXTENSION,
        );

        const defaultEnvironmentExists = await fse.pathExists(defaultEnvironmentPath);
        if (this.allEnvironments.get(DEFAULT_ENVIRONMENT_NAME) || defaultEnvironmentExists) {
            throw new TargetExistsError(`Environment "${DEFAULT_ENVIRONMENT_NAME}" exists, will not overwrite`);
        }

        const config = {
            id: DEFAULT_ENVIRONMENT_NAME,
            neo4jDataPath: this.dirPaths.data,
            type: ENVIRONMENT_TYPES.LOCAL,
            user: undefined,
            dbmss: {},
        };
        const configModel = new EnvironmentConfigModel(config);
        const defaultEnvironment = await createEnvironmentInstance(configModel);

        await fse.writeJSON(defaultEnvironmentPath, config, {spaces: 2});
        this.allEnvironments.set(DEFAULT_ENVIRONMENT_NAME, defaultEnvironment);
    }

    private async discoverEnvironments(): Promise<void> {
        this.allEnvironments.clear();
        const environmentsDir = path.join(this.dirPaths.config, ENVIRONMENTS_DIR_NAME);
        const availableFiles = await fse.readdir(environmentsDir);
        const availableEnvironments = _.filter(
            availableFiles,
            (environment) => path.extname(environment).toLocaleLowerCase() === JSON_FILE_EXTENSION,
        );
        const environmentConfigs: string[] = await Promise.all(
            _.map(availableEnvironments, (environment) =>
                fse.readFile(path.join(environmentsDir, environment), 'utf8'),
            ),
        );

        const createEnvironmentPromises = _.map(environmentConfigs, async (environmentConfigBuffer) => {
            const config = JSON.parse(environmentConfigBuffer);
            const environmentConfig: EnvironmentConfigModel = new EnvironmentConfigModel({
                ...config,
                neo4jDataPath: config.neo4jDataPath || this.dirPaths.data,
            });

            this.allEnvironments.set(`${environmentConfig.id}`, await createEnvironmentInstance(environmentConfig));
        });

        await Promise.all(createEnvironmentPromises);
    }

    createAppLaunchToken(
        environmentId: string,
        appId: string,
        dbmsId: string,
        principal: string,
        accessToken: string,
    ): Promise<string> {
        const jwtTokenSalt = `${JWT_INSTANCE_TOKEN_SALT}-${appId}`;
        const validated = JSON.parse(
            JSON.stringify(
                new AppLaunchTokenModel({
                    accessToken,
                    environmentId,
                    appId,
                    dbmsId,
                    principal,
                }),
            ),
        );

        return new Promise((resolve, reject) => {
            jwt.sign(validated, jwtTokenSalt, {expiresIn: TWENTY_FOUR_HOURS_SECONDS}, (err, token) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(token);
            });
        });
    }

    parseAppLaunchToken(appId: string, launchToken: string): Promise<IAppLaunchToken> {
        const jwtTokenSalt = `${JWT_INSTANCE_TOKEN_SALT}-${appId}`;

        return new Promise((resolve, reject) => {
            jwt.verify(launchToken, jwtTokenSalt, (err: any, decoded: any) => {
                if (err) {
                    reject(new ValidationFailureError('Failed to decode App Launch Token'));
                    return;
                }

                if (decoded.appId !== appId) {
                    reject(new ValidationFailureError('App Launch Token mismatch'));
                    return;
                }

                try {
                    resolve(
                        new AppLaunchTokenModel({
                            accessToken: decoded.accessToken,
                            environmentId: decoded.environmentId,
                            appId: decoded.appId,
                            dbmsId: decoded.dbmsId,
                            principal: decoded.principal,
                        }),
                    );
                    return;
                } catch (e) {
                    if (e instanceof ValidationFailureError) {
                        reject(e);
                        return;
                    }

                    reject(new ValidationFailureError('Invalid App Launch Token'));
                }
            });
        });
    }
}
