import {AccountAbstract} from './account.abstract';
import {NotAllowedError} from '../errors';

export class AuraAccount extends AccountAbstract {
    startDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support starting DBMSs`);
    }

    stopDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support stopping DBMSs`);
    }

    statusDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${AuraAccount.name} does not support getting DBMSs status`);
    }
}
