import {AccountAbstract} from './account.abstract';
import {NotAllowedError} from '../errors';

export class AuraAccount extends AccountAbstract {
    startDBMS(_: string): Promise<boolean> {
        throw new NotAllowedError(`${AuraAccount.name} does not support starting DBMSs`);
    }

    stopDBMS(_: string): Promise<boolean> {
        throw new NotAllowedError(`${AuraAccount.name} does not support stopping DBMSs`);
    }

    statusDBMS(_: string): Promise<boolean> {
        // fetch(...).then(...)
        return Promise.resolve(true);
    }
}
