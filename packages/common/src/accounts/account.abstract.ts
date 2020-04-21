import {IAuthToken} from 'tapestry';

import {AccountConfigModel, IDbms} from '../models';

export abstract class AccountAbstract {
    get id(): string {
        return this.config.id;
    }

    constructor(protected config: AccountConfigModel) {}

    init(): Promise<void> {
        return Promise.resolve();
    }

    abstract installDbms(name: string, credentials: string, version: string): Promise<string>;

    abstract uninstallDbms(dbmsId: string): Promise<void>;

    abstract listDbmss(): Promise<IDbms[]>;

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string>;
}
