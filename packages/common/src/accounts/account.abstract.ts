import {IAuthToken} from 'tapestry';

import {AccountConfigModel} from '../models';
import {IDbms} from '../models/account-config.model';

export abstract class AccountAbstract {
    constructor(protected readonly config: AccountConfigModel) {}

    init(): Promise<void> {
        return Promise.resolve();
    }

    abstract installDbms(name: string, credentials: string, version: string): Promise<string>;

    abstract listDbmss(): Promise<IDbms[]>;

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string>;
}
