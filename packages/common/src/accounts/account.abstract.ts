import {AccountConfigModel} from '../models';
import {IAuthToken} from 'tapestry';

export abstract class AccountAbstract {
    constructor(protected readonly config: AccountConfigModel) {}

    abstract listDbmss(): Promise<string[]>;

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract createAccessToken(appId: string, dbmsId: string, authToken: IAuthToken): Promise<string>;
}
