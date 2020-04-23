import {v4 as uuid} from 'uuid';

import {AccountConfigModel} from '../models';
import {ACCOUNT_TYPES} from './account.constants';
import {InvalidConfigError, NotSupportedError, NotFoundError} from '../errors';

import {AccountAbstract} from './account.abstract';
import {LocalAccount} from './local.account';

export async function createAccountInstance(config: AccountConfigModel): Promise<AccountAbstract> {
    let account: AccountAbstract;
    switch (config.type) {
        case ACCOUNT_TYPES.LOCAL:
            account = new LocalAccount(config);
            break;
        default:
            throw new InvalidConfigError(`Account type ${config.type} not supported`);
    }

    await account.init();
    return account;
}

export class TestDbmss {
    dbmsNames: string[] = [];

    account: AccountAbstract;

    constructor(account: AccountAbstract) {
        if (process.env.NODE_ENV !== 'test') {
            throw new NotSupportedError('Cannot use DbmsGen outside of testing environment');
        }

        this.account = account;
    }

    createName(): string {
        const name = uuid();
        this.dbmsNames.push(name);
        return name;
    }

    async createDbms(): Promise<string> {
        const version = process.env.TEST_NEO4J_VERSION || '4.0.4';
        const name = this.createName();

        await this.account.installDbms(name, 'password', version);
        return name;
    }

    async teardown(): Promise<void> {
        const uninstallAll = this.dbmsNames.map((name) =>
            this.account.uninstallDbms(name).catch((e) => {
                if (e instanceof NotFoundError) {
                    return;
                }
                throw e;
            }),
        );
        await Promise.all(uninstallAll);
    }
}
