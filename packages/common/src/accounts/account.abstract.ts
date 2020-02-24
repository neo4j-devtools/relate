import {AccountConfigModel} from '../models';

export abstract class AccountAbstract {
    constructor(protected readonly config: AccountConfigModel) {}

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;
}
