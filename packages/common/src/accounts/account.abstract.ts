export interface IAccount {
    id: string;
    user: any;
}

export abstract class AccountAbstract {
    constructor(protected readonly config: IAccount) {}

    abstract startDBMS(uuid: string): Promise<string>;

    abstract stopDBMS(uuid: string): Promise<string>;

    abstract statusDBMS(uuid: string): Promise<string>;
}
