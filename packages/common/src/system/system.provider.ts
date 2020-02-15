import envPaths from 'env-paths';
import path from 'path';
import {Injectable, OnModuleInit} from '@nestjs/common';
import {readdir, readFile} from 'fs-extra';

import {AccountAbstract} from '../accounts/account.abstract';
import {LocalAccount} from '../accounts';
import {AccountNotFoundError, ConfigNotFoundError, InvalidConfigError} from '../errors';

@Injectable()
export class SystemProvider implements OnModuleInit {
    protected readonly allAccounts: Map<string, AccountAbstract> = new Map<string, AccountAbstract>();

    onModuleInit() {
        return this.discoverAccounts().catch((err: Error) => {
            throw err;
        });
    }

    getAccount(uuid: string): AccountAbstract {
        const account = this.allAccounts.get(uuid);
        if (account) {
            return account;
        }

        throw new AccountNotFoundError(`Account not found: ${uuid}`);
    }

    private async discoverAccounts(): Promise<void> {
        const {config: neo4jConfigPath} = envPaths('daedalus', {suffix: ''});

        let accounts: string[] = [];
        try {
            accounts = await readdir(`${neo4jConfigPath}/accounts`);
            accounts.filter((account) => path.extname(account).toLocaleLowerCase() === '.json');
        } catch (e) {
            throw new ConfigNotFoundError('Config dir not found');
        }

        const accountPromiseArray: Promise<Buffer>[] = accounts.map((account) => {
            return readFile(`${neo4jConfigPath}/accounts/${account}`).catch((e) => {
                throw e;
            });
        });

        const accountConfigArray: Buffer[] = await Promise.all(accountPromiseArray);

        interface IAccountConfig {
            id: any;
            user: any;
            neo4jDataPath: any;
            type: string;
        }

        accountConfigArray.forEach((accountConfigBuffer) => {
            const accountConfig: IAccountConfig = JSON.parse(accountConfigBuffer.toString());
            if (!accountConfig.id || !accountConfig.user || !accountConfig.neo4jDataPath || !accountConfig.type) {
                throw new InvalidConfigError('Config missing properties');
            }

            const accountConstructors: {[key: string]: typeof LocalAccount} = {
                LOCAL: LocalAccount,
            };

            const createAccount = (accountConfiguration: IAccountConfig): AccountAbstract => {
                return new accountConstructors[accountConfig.type.toLocaleUpperCase()]({
                    id: `${accountConfiguration.id}`,
                    user: `${accountConfiguration.user}`,
                    neo4jDataPath:
                        process.env.NEO4J_DATA_PATH ||
                        `${accountConfiguration.neo4jDataPath}/${accountConfiguration.id}`,
                });
            };

            this.allAccounts.set(`${accountConfig.id}`, createAccount(accountConfig));
        });
    }
}
