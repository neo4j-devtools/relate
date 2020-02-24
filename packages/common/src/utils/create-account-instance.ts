import {AccountConfigModel} from '../models';
import {AccountAbstract, LocalAccount} from '../accounts';
import {ACCOUNT_TYPES} from '../constants';
import {InvalidConfigError} from '../errors';

export function createAccountInstance(config: AccountConfigModel): AccountAbstract {
    if (config.type === ACCOUNT_TYPES.LOCAL) {
        return new LocalAccount(config);
    }

    throw new InvalidConfigError(`Account type ${config.type} not supported`);
}
