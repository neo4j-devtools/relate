import {IAuthToken} from 'tapestry';

import {AccountAbstract} from './account.abstract';
import {NotAllowedError} from '../errors';
import {IDbms, IDbmsVersion} from '../models';

export class AuraAccount extends AccountAbstract {
    listDbmsVersions(): Promise<IDbmsVersion[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support listing DBMS versions`);
    }

    installDbms(_name: string, _credentials: string, _version: string): Promise<string> {
        throw new NotAllowedError(`${AuraAccount.name} does not support installing a DBMS`);
    }

    uninstallDbms(_name: string): Promise<void> {
        throw new NotAllowedError(`${AuraAccount.name} does not support uninstalling a DBMS`);
    }

    listDbmss(): Promise<IDbms[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support listing DBMSs`);
    }

    startDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support starting DBMSs`);
    }

    stopDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support stopping DBMSs`);
    }

    statusDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support getting DBMSs status`);
    }

    createAccessToken(_appId: string, _dbmsId: string, _authToken: IAuthToken): Promise<string> {
        throw new NotAllowedError(`${AuraAccount.name} does not support creating access tokens`);
    }

    updateDbmsConfig(_dbmsId: string, _properties: Map<string, string>): Promise<void> {
        throw new NotAllowedError(`${AuraAccount.name} does not support updating DBMSs config`);
    }
}
