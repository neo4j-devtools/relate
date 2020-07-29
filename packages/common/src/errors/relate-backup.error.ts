import {List} from '@relate/types';

import {ErrorAbstract} from './error.abstract';

export class RelateBackupError extends ErrorAbstract {
    constructor(message: string, errors: List<string>) {
        super(`${message}:\n\nErrors:\n${errors.mapEach((err) => `- ${err}`).join('\n')}`);
    }
}
