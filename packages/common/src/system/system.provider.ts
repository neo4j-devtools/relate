import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {Readable} from 'stream';
import fse, {createWriteStream, ensureDir} from 'fs-extra';
import {List, Dict, None, Maybe} from '@relate/types';
import {v4 as uuidv4} from 'uuid';

import {JSON_FILE_EXTENSION, DBMS_DIR_NAME, RELATE_KNOWN_CONNECTIONS_FILE} from '../constants';
import {EnvironmentAbstract, ENVIRONMENTS_DIR_NAME} from '../entities/environments';
import {NotFoundError, TargetExistsError, FileUploadError} from '../errors';
import {EnvironmentConfigModel, IEnvironmentConfigInput} from '../models';
import {envPaths, getSystemAccessToken, registerSystemAccessToken} from '../utils';
import {createEnvironmentInstance} from '../utils/system';
import {ensureDirs, ensureFiles} from './files';
import {verifyAcceptedTerms} from './verifyAcceptedTerms';

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

    protected allEnvironments = Dict.from<Map<string, EnvironmentAbstract>>(new Map());

    async onModuleInit(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await ensureFiles(this.filePaths);
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
        await registerSystemAccessToken(
            this.filePaths.knownConnections,
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
        const token = await getSystemAccessToken(this.filePaths.knownConnections, environment.id, dbms.id, dbmsUser);

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
            ...config,
            configPath: filePath,
            id: newId,
        });
        const environment = await createEnvironmentInstance(configModel);

        await fse.writeJSON(filePath, configModel, {spaces: 2});
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

        await ensureDir(tmpDir);

        try {
            const uploadPromise = new Promise((resolve, reject) =>
                readStream
                    .pipe(createWriteStream(tmpFileName))
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
