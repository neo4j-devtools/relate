import {AccountConfigModel} from '../models';
import {ACCOUNT_TYPES} from './account.constants';
import {InvalidConfigError} from '../errors';

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
