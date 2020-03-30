import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {ensureDir, ensureFile, readdir, readFile} from 'fs-extra';
import {filter, map} from 'lodash';

import {envPaths} from '../utils/env-paths';
import {JSON_FILE_EXTENSION, RELATE_KNOWN_CONNECTIONS_FILE, DEFAULT_ACCOUNT_NAME} from '../constants';
import {NotFoundError} from '../errors';
import {AccountConfigModel} from '../models';
import {registerSystemAccessToken} from '../utils';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly paths = envPaths();

    protected readonly knownConnectionsPath = path.join(this.paths.data, RELATE_KNOWN_CONNECTIONS_FILE);

    protected readonly allAccounts: Map<string, AccountAbstract> = new Map<string, AccountAbstract>();

    async onModuleInit(): Promise<void> {
        await this.verifyInstallation();
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
        await registerSystemAccessToken(this.knownConnectionsPath, accountId, dbmsId, dbmsUser, accessToken);

        return accessToken;
    }

    private async discoverAccounts(): Promise<void> {
        const accountsDir = path.join(this.paths.config, ACCOUNTS_DIR_NAME);
        const availableFiles = await readdir(accountsDir);
        const availableAccounts = filter(
            availableFiles,
            (account) => path.extname(account).toLocaleLowerCase() === JSON_FILE_EXTENSION,
        );
        const accountConfigs: string[] = await Promise.all(
            map(availableAccounts, (account) => readFile(path.join(accountsDir, account), 'utf8')),
        );

        const createAccountPromises = map(accountConfigs, async (accountConfigBuffer) => {
            const config = JSON.parse(accountConfigBuffer);
            const accountConfig: AccountConfigModel = new AccountConfigModel({
                ...config,
                neo4jDataPath: config.neo4jDataPath || this.paths.data,
            });

            this.allAccounts.set(`${accountConfig.id}`, await createAccountInstance(accountConfig));
        });

        await Promise.all(createAccountPromises);
    }

    private async verifyInstallation(): Promise<void> {
        await ensureDir(this.paths.config);
        await ensureDir(path.join(this.paths.config, ACCOUNTS_DIR_NAME));

        await ensureDir(this.paths.data);
        await ensureFile(this.knownConnectionsPath);
    }
}
