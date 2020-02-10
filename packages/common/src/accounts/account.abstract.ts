export interface IAccount {
    id: string;
    user: any;
}

export abstract class AccountAbstract {
    constructor(protected readonly config: IAccount) {}

    abstract startDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract stopDbmss(dbmsIds: string[]): Promise<string[]>;

    abstract statusDbmss(dbmsIds: string[]): Promise<string[]>;
}
