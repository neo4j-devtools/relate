import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import fse from 'fs-extra';
import _ from 'lodash';

import {JSON_FILE_EXTENSION, RELATE_KNOWN_CONNECTIONS_FILE, DEFAULT_ACCOUNT_NAME} from '../constants';
import {AccountAbstract, ACCOUNTS_DIR_NAME, createAccountInstance, ACCOUNT_TYPES} from '../accounts';
import {NotFoundError, TargetExistsError} from '../errors';
import {AccountConfigModel} from '../models';
import {envPaths, registerSystemAccessToken} from '../utils';
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
}
