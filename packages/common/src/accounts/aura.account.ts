import {AccountAbstract} from './account.abstract';
import {NotAllowedError} from '../errors';
import {IAuthToken} from 'tapestry';

export class AuraAccount extends AccountAbstract {
    installDbms(_name: string, _credentials: string, _version: string): Promise<string> {
        throw new NotAllowedError(`${AuraAccount.name} does not support installing a DBMS`);
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
}
