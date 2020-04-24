import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import fse from 'fs-extra';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import {
    DEFAULT_ACCOUNT_NAME,
    JSON_FILE_EXTENSION,
    JWT_INSTANCE_TOKEN_SALT,
    RELATE_KNOWN_CONNECTIONS_FILE,
    TWENTY_FOUR_HOURS_SECONDS,
} from '../constants';
import {ACCOUNT_TYPES, AccountAbstract, ACCOUNTS_DIR_NAME, createAccountInstance} from '../accounts';
import {NotFoundError, ValidationFailureError, TargetExistsError} from '../errors';
import {AccountConfigModel, AppLaunchTokenModel, IAppLaunchToken} from '../models';
import {envPaths, getSystemAccessToken, registerSystemAccessToken} from '../utils';
import {ensureDirs, ensureFiles} from '../system';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly dirPaths = {
        ...envPaths(),
        accounts: path.join(envPaths().config, ACCOUNTS_DIR_NAME),
    };

    protected readonly filePaths = {
        knownConnections: path.join(envPaths().data, RELATE_KNOWN_CONNECTIONS_FILE),
    };

    protected readonly allAccounts: Map<string, AccountAbstract> = new Map<string, AccountAbstract>();

    async onModuleInit(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await ensureFiles(this.filePaths);
        await this.discoverAccounts();
    }

    getAccount(uuid: string | undefined): AccountAbstract {
        const account = this.allAccounts.get(uuid ? uuid : DEFAULT_ACCOUNT_NAME);

        if (!account) {
            throw new NotFoundError(`Account "${uuid}" not found`);
        }

        return account;
    }

    async registerAccessToken(
        accountId: string,
        dbmsId: string,
        dbmsUser: string,
        accessToken: string,
    ): Promise<string> {
        await registerSystemAccessToken(this.filePaths.knownConnections, accountId, dbmsId, dbmsUser, accessToken);

        return accessToken;
    }

    async initInstallation(): Promise<void> {
        await ensureDirs(this.dirPaths);
        await ensureFiles(this.filePaths);
        const defaultAccountPath = path.join(
            this.dirPaths.config,
            ACCOUNTS_DIR_NAME,
            DEFAULT_ACCOUNT_NAME + JSON_FILE_EXTENSION,
        );

        const defaultAccountExists = await fse.pathExists(defaultAccountPath);
        if (this.allAccounts.get(DEFAULT_ACCOUNT_NAME) || defaultAccountExists) {
            throw new TargetExistsError(`Account "${DEFAULT_ACCOUNT_NAME}" exists, will not overwrite`);
        }

        const config = {
            id: DEFAULT_ACCOUNT_NAME,
            neo4jDataPath: this.dirPaths.data,
            type: ACCOUNT_TYPES.LOCAL,
            user: undefined,
            dbmss: {},
        };
        const configModel = new AccountConfigModel(config);
        const defaultAccount = await createAccountInstance(configModel);

        await fse.writeJSON(defaultAccountPath, config, {spaces: 2});
        this.allAccounts.set(DEFAULT_ACCOUNT_NAME, defaultAccount);
    }

    async getAccessToken(accountId: string, dbmsId: string, dbmsUser: string): Promise<string> {
        const token = await getSystemAccessToken(this.filePaths.knownConnections, accountId, dbmsId, dbmsUser);

        if (!token) {
            throw new NotFoundError(`No Access Token found for user "${dbmsUser}"`);
        }

        return token;
    }

    private async discoverAccounts(): Promise<void> {
        this.allAccounts.clear();
        const accountsDir = path.join(this.dirPaths.config, ACCOUNTS_DIR_NAME);
        const availableFiles = await fse.readdir(accountsDir);
        const availableAccounts = _.filter(
            availableFiles,
            (account) => path.extname(account).toLocaleLowerCase() === JSON_FILE_EXTENSION,
        );
        const accountConfigs: string[] = await Promise.all(
            _.map(availableAccounts, (account) => fse.readFile(path.join(accountsDir, account), 'utf8')),
        );

        const createAccountPromises = _.map(accountConfigs, async (accountConfigBuffer) => {
            const config = JSON.parse(accountConfigBuffer);
            const accountConfig: AccountConfigModel = new AccountConfigModel({
                ...config,
                neo4jDataPath: config.neo4jDataPath || this.dirPaths.data,
            });

            this.allAccounts.set(`${accountConfig.id}`, await createAccountInstance(accountConfig));
        });

        await Promise.all(createAccountPromises);
    }

    createAppLaunchToken(
        accountId: string,
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
                    accountId,
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
                            accountId: decoded.accountId,
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
