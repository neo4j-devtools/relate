export interface IAccount {
    id: string;
    user: any;
}

export abstract class AccountAbstract {
    constructor(protected readonly config: IAccount) {}

    abstract startDBMS(identifier: string): Promise<boolean>;

    abstract stopDBMS(identifier: string): Promise<boolean>;

    abstract statusDBMS(identifier: string): Promise<boolean>;
}
