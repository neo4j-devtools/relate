import {Injectable} from '@nestjs/common';

import {AccountAbstract} from '../accounts/account.abstract';
import {LocalAccount} from '../accounts';
import {AccountNotFoundError} from '../errors';

@Injectable()
export class SystemProvider {
    protected readonly allAccounts: Map<string, AccountAbstract> = new Map<string, AccountAbstract>();

    constructor() {
        this.discoverAccounts();
    }

    getAccount(uuid: string): AccountAbstract {
        const account = this.allAccounts.get(uuid);
        if (account) {
            return account;
        }

        throw new AccountNotFoundError(`Account not found: ${uuid}`);
    }

    protected discoverAccounts(): void {
        // do stuff to discover and load accounts
        this.allAccounts.set(
            'foo',
            new LocalAccount({
                id: 'foo',
                user: {bar: 'baz'},
            }),
        );
    }
}
