import {List} from '@relate/types';
import {ReadStream} from 'fs-extra';

import {IDb} from '../../models';

import {EnvironmentAbstract} from '../environments';

export abstract class DbsAbstract<Env extends EnvironmentAbstract> {
    constructor(protected readonly environment: Env) {}

    abstract create(dbmsId: string, user: string, dbName: string, accessToken: string): Promise<void>;

    abstract drop(dbmsId: string, user: string, dbName: string, accessToken: string): Promise<void>;

    abstract list(dbmsId: string, user: string, accessToken: string): Promise<List<IDb>>;

    abstract dump(dbmsId: string, database: string, to: string, javaPath?: string): Promise<string>;

    abstract load(dbmsId: string, database: string, from: string, force?: boolean, javaPath?: string): Promise<string>;

    abstract exec(
        dbmsId: string,
        from: string | ReadStream,
        args: {database: string; user: string; password: string},
    ): Promise<string>;
}
