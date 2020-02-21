import {envPaths} from '../env-paths';
import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {readdir, readFile} from 'fs-extra';

import {AccountAbstract} from '../accounts/account.abstract';
import {LocalAccount} from '../accounts';
import {NotFoundError, InvalidConfigError} from '../errors';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly allAccounts: Map<string, AccountAbstract> = new Map<string, AccountAbstract>();

    onModuleInit() {
        return this.discoverAccounts();
    }

    getAccount(uuid: string): AccountAbstract {
        const account = this.allAccounts.get(uuid);
        if (!account) {
            throw new NotFoundError(`Account "${uuid}" not found`);
        }

        return account;
    }

    private async discoverAccounts(): Promise<void> {
        const {config: neo4jConfigPath} = envPaths();
        const accountsDir = path.join(neo4jConfigPath, 'accounts');

        let accounts: string[] = [];
        try {
            accounts = await readdir(accountsDir);
            accounts = accounts.filter((account) => path.extname(account).toLocaleLowerCase() === '.json');
        } catch (e) {
            throw new NotFoundError(`Config directory "${accountsDir}" not found`);
        }

        const accountPromiseArray: Promise<Buffer>[] = accounts.map((account) => {
            return readFile(path.join(neo4jConfigPath, 'accounts', account));
        });

        const accountConfigArray: Buffer[] = await Promise.all(accountPromiseArray);

        interface IAccountConfig {
            id: any;
            user: any;
            neo4jDataPath: any;
            type: string;
        }

        accountConfigArray.forEach((accountConfigBuffer) => {
            const {data: defaultNeo4jDataPath} = envPaths();
            const accountConfig: IAccountConfig = JSON.parse(accountConfigBuffer.toString());

            if (!accountConfig.id || !accountConfig.user || !accountConfig.type) {
                throw new InvalidConfigError('Config missing properties');
            }

            const accountConstructors: {[key: string]: typeof LocalAccount} = {
                LOCAL: LocalAccount,
            };

            const createAccount = (accountConfiguration: IAccountConfig): AccountAbstract => {
                return new accountConstructors[accountConfig.type.toLocaleUpperCase()]({
                    id: `${accountConfiguration.id}`,
                    user: `${accountConfiguration.user}`,
                    neo4jDataPath: accountConfiguration.neo4jDataPath || defaultNeo4jDataPath,
                });
            };

            this.allAccounts.set(`${accountConfig.id}`, createAccount(accountConfig));
        });
    }
}
