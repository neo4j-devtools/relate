import {List} from '@relate/types';

import {IDb} from '../../models';

import {DbsAbstract} from './dbs.abstract';
import {RemoteEnvironment} from '../environments';
import {NotSupportedError} from '../../errors';

export class RemoteDbs extends DbsAbstract<RemoteEnvironment> {
    create(_dbmsId: string, _dbmsUser: string, _dbName: string, _accessToken: string): Promise<void> {
        throw new NotSupportedError(`${RemoteDbs.name} does not support creating databases`);
    }

    drop(_dbmsId: string, _dbmsUser: string, _dbName: string, _accessToken: string): Promise<void> {
        throw new NotSupportedError(`${RemoteDbs.name} does not support dropping databases`);
    }

    dump(dbmsId: string, db: string): Promise<string> {
        throw new NotSupportedError(`Not implemented yet. ${dbmsId} ${db}`);
    }

    load(dbmsId: string, db: string): Promise<string> {
        throw new NotSupportedError(`Not implemented yet. ${dbmsId} ${db}`);
    }

    exec(dbmsId: string, db: string): Promise<string> {
        throw new NotSupportedError(`Not implemented yet. ${dbmsId} ${db}`);
    }

    list(_dbmsId: string, _dbmsUser: string, _accessToken: string): Promise<List<IDb>> {
        throw new NotSupportedError(`${RemoteDbs.name} does not support listing databases`);
    }
}
