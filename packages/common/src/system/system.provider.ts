import path from 'path';
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import fse from 'fs-extra';
import {List, Dict, None, Maybe} from '@relate/types';
import {v4 as uuidv4} from 'uuid';
import {ConfigService} from '@nestjs/config';

import {ENTITY_TYPES, JSON_FILE_EXTENSION, RELATE_ACCESS_TOKENS_DIR_NAME} from '../constants';
import {EnvironmentAbstract, ENVIRONMENTS_DIR_NAME} from '../entities/environments';
import {FileUploadError, NotFoundError, TargetExistsError} from '../errors';
import {EnvironmentConfigModel, IEnvironmentConfigInput} from '../models';
import {envPaths, getSystemAccessToken, registerSystemAccessToken} from '../utils';
import {createEnvironmentInstance} from '../utils/system';
import {ensureDirs} from './files';
import {verifyAcceptedTerms} from './verifyAcceptedTerms';
import {Readable} from 'stream';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly dirPaths = {
        ...envPaths(),
        environmentsConfig: path.join(envPaths().config, ENVIRONMENTS_DIR_NAME),
    };

    protected allEnvironments = Dict.from<Map<string, EnvironmentAbstract>>(new Map());

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    async onModuleInit(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await verifyAcceptedTerms();
        await this.reloadEnvironments();
    }

    async useEnvironment(nameOrId: string): Promise<EnvironmentAbstract> {
        // Get the environment before modifying any config to make sure we don't
        // make any changes in case it doesn't exist.
        const defaultEnvironment = await this.getEnvironment(nameOrId);

        await this.allEnvironments.values
            .mapEach(async (env) => {
                await env.updateConfig('active', env.id === defaultEnvironment.id);
            })
            .unwindPromises();

        return defaultEnvironment;
    }

    async getEnvironment(nameOrId?: string): Promise<EnvironmentAbstract> {
        await this.reloadEnvironments();

        if (nameOrId) {
            const environment: Maybe<EnvironmentAbstract> = this.allEnvironments.values.find(
                (env) => env.id === nameOrId || env.name === nameOrId,
            );

            return environment.flatMap((env) => {
                if (None.isNone(env)) {
                    throw new NotFoundError(`Environment "${nameOrId}" not found`);
                }

                return env;
            });
        }

        const configId = this.configService.get('defaultEnvironmentNameOrId');
        if (configId) {
            const environment: Maybe<EnvironmentAbstract> = this.allEnvironments.values.find(
                (env) => env.id === configId || env.name === configId,
            );

            return environment.flatMap((env) => {
                if (None.isNone(env)) {
                    throw new NotFoundError(`Environment "${configId}" not found`);
                }

                return env;
            });
        }

        const activeEnvironment = this.allEnvironments.values.find((env) => env.isActive);

        return activeEnvironment.flatMap((env) => {
            if (None.isNone(env)) {
                throw new NotFoundError(`No environment in use`, [
                    'Run relate env:use <environment> first to set an active environment',
                ]);
            }

            return env;
        });
    }

    async registerAccessToken(
        environmentNameOrId: string,
        dbmsId: string,
        dbmsUser: string,
        accessToken: string,
    ): Promise<string> {
        const environment = await this.getEnvironment(environmentNameOrId);

        await fse.ensureDir(path.join(environment.dataPath, RELATE_ACCESS_TOKENS_DIR_NAME));
        await registerSystemAccessToken(
            path.join(environment.dataPath, RELATE_ACCESS_TOKENS_DIR_NAME),
            environmentNameOrId,
            dbmsId,
            dbmsUser,
            accessToken,
        );

        return accessToken;
    }

    async getAccessToken(environmentNameOrId: string, dbmsId: string, dbmsUser: string): Promise<string> {
        const environment = await this.getEnvironment(environmentNameOrId);
        const dbms = await environment.dbmss.get(dbmsId);
        const token = await getSystemAccessToken(
            path.join(environment.dataPath, RELATE_ACCESS_TOKENS_DIR_NAME),
            environment.id,
            dbms.id,
            dbmsUser,
        );

        if (!token) {
            throw new NotFoundError(`No Access Token found for user "${dbmsUser}"`);
        }

        return token;
    }

    async createEnvironment(config: IEnvironmentConfigInput): Promise<EnvironmentAbstract> {
        const newId = uuidv4();
        const fileName = `${config.name}${JSON_FILE_EXTENSION}`;
        const filePath = path.join(this.dirPaths.environmentsConfig, fileName);
        const environmentExists = await this.getEnvironment(config.name).catch(() => null);

        if (environmentExists) {
            throw new TargetExistsError(`Environment "${config.name}" exists, will not overwrite`);
        }

        const configModel = new EnvironmentConfigModel({
            relateDataPath: path.join(envPaths().data, `${ENTITY_TYPES.ENVIRONMENT}-${newId}`),
            ...config,
            configPath: filePath,
            id: newId,
        });
        const environment = await createEnvironmentInstance(configModel);

        await fse.writeJSON(filePath, configModel, {
            encoding: 'utf-8',
            spaces: 2,
        });
        this.allEnvironments.setValue(environment.id, environment);

        return environment;
    }

    private async reloadEnvironments(): Promise<void> {
        const configs = await List.from(await fse.readdir(this.dirPaths.environmentsConfig).catch(() => []))
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
                                relateDataPath: config.relateDataPath || this.dirPaths.data,
                            }),
                    )
                    .catch(() => None.EMPTY);
            })
            .unwindPromises();
        const instances = await configs
            .compact()
            .mapEach((environmentConfig) => createEnvironmentInstance(environmentConfig))
            .unwindPromises();

        this.allEnvironments = Dict.from(instances.mapEach((env): [string, EnvironmentAbstract] => [env.id, env]));
    }

    async listEnvironments(): Promise<List<EnvironmentAbstract>> {
        await this.reloadEnvironments();

        return this.allEnvironments.values;
    }

    async handleFileUpload(fileName: string, readStream: Readable): Promise<string> {
        const tmpDir = path.join(envPaths().tmp, uuidv4());
        const tmpFileName = path.join(tmpDir, `${uuidv4()}.rdownload`);

        await fse.ensureDir(tmpDir);

        try {
            const uploadPromise = new Promise((resolve, reject) =>
                readStream
                    .pipe(fse.createWriteStream(tmpFileName))
                    .on('finish', () => resolve())
                    .on('error', (err) => reject(err)),
            );

            await uploadPromise;

            const uploadedFileName = path.join(tmpDir, fileName);

            await fse.move(tmpFileName, uploadedFileName);

            return uploadedFileName;
        } catch (_e) {
            throw new FileUploadError(`Failed to upload file ${fileName}`);
        }
    }
}
