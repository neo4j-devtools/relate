import {AccountAbstract} from './account.abstract';
import {NotAllowedError} from '../errors';

export class AuraAccount extends AccountAbstract {
    startDBMS(_uuid: string): Promise<string> {
        throw new NotAllowedError(`${AuraAccount.name} does not support starting DBMSs`);
    }

    stopDBMS(_uuid: string): Promise<string> {
        throw new NotAllowedError(`${AuraAccount.name} does not support stopping DBMSs`);
    }

    statusDBMS(_uuid: string): Promise<string> {
        // fetch(...).then(...)
        return Promise.resolve('');
    }
}
