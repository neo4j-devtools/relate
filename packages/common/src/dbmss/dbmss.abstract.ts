import {List} from '@relate/types';
import {IAuthToken} from '@huboneo/tapestry';

import {IDbms, IDbmsInfo, IDbmsVersion} from '../models';

import {EnvironmentAbstract} from '../environments';
import {PropertiesFile} from '../system/files';

export abstract class DbmssAbstract<Env extends EnvironmentAbstract> {
    public dbmss: {[id: string]: IDbms} = {};

    constructor(protected readonly environment: Env) {}

    abstract versions(): Promise<List<IDbmsVersion>>;

    abstract install(name: string, credentials: string, version: string): Promise<string>;

    abstract uninstall(dbmsId: string): Promise<void>;

    abstract list(): Promise<List<IDbms>>;

    abstract get(nameOrId: string): Promise<IDbms>;

    abstract start(dbmsIds: string[] | List<string>): Promise<List<string>>;

    abstract stop(dbmsIds: string[] | List<string>): Promise<List<string>>;

    abstract info(dbmsIds: string[] | List<string>): Promise<List<IDbmsInfo>>;

    abstract createAccessToken(appName: string, dbmsId: string, authToken: IAuthToken): Promise<string>;

    abstract getDbmsConfig(dbmsId: string): Promise<PropertiesFile>;
}
