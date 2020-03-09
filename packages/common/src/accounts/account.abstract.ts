import {IAuthToken} from 'tapestry';

import {AccountConfigModel} from '../models';
import {IDbms} from '../models/account-config.model';

export abstract class AccountAbstract {
    constructor(protected readonly config: AccountConfigModel) {}

    abstract listDbmss(): Promise<IDbms[]>;

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string>;
}
