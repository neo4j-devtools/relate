import {AccountConfigModel} from '../models';
import {ACCOUNT_TYPES} from './account.constants';
import {InvalidConfigError} from '../errors';

import {AccountAbstract} from './account.abstract';
import {LocalAccount} from './local.account';

export function createAccountInstance(config: AccountConfigModel): AccountAbstract {
    if (config.type === ACCOUNT_TYPES.LOCAL) {
        return new LocalAccount(config);
    }

    throw new InvalidConfigError(`Account type ${config.type} not supported`);
}
