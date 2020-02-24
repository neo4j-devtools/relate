import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {ensureDir, readdir, readFile} from 'fs-extra';
import {filter, forEach, map} from 'lodash';

import {envPaths} from '../env-paths';
import {ACCOUNTS_DIR_NAME, JSON_FILE_EXTENSION} from '../constants';
import {AccountAbstract} from '../accounts';
import {NotFoundError} from '../errors';
import {AccountConfigModel} from '../models';
import {createAccountInstance} from '../utils';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly paths = envPaths();

    protected readonly allAccounts: Map<string, AccountAbstract> = new Map<string, AccountAbstract>();

    async onModuleInit(): Promise<void> {
        await this.verifyInstallation();
        await this.discoverAccounts();
    }

    getAccount(uuid: string): AccountAbstract {
        const account = this.allAccounts.get(uuid);

        if (!account) {
            throw new NotFoundError(`Account "${uuid}" not found`);
        }

        return account;
    }

    private async discoverAccounts(): Promise<void> {
        const accountsDir = path.join(this.paths.config, ACCOUNTS_DIR_NAME);
        const availableFiles = await readdir(accountsDir);
        const availableAccounts = filter(
            availableFiles,
            (account) => path.extname(account).toLocaleLowerCase() === JSON_FILE_EXTENSION,
        );
        const accountConfigs: string[] = await Promise.all(
            map(availableAccounts, (account) =>
                readFile(path.join(this.paths.config, ACCOUNTS_DIR_NAME, account), 'utf8'),
            ),
        );

        forEach(accountConfigs, (accountConfigBuffer) => {
            const config = JSON.parse(accountConfigBuffer);
            const accountConfig: AccountConfigModel = new AccountConfigModel({
                ...config,
                neo4jDataPath: config.neo4jDataPath || this.paths.data,
            });

            this.allAccounts.set(`${accountConfig.id}`, createAccountInstance(accountConfig));
        });
    }

    private async verifyInstallation(): Promise<void> {
        await ensureDir(path.join(this.paths.config, ACCOUNTS_DIR_NAME));
        await ensureDir(this.paths.data);
    }
}
