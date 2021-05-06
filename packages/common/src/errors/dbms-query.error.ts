import {ErrorAbstract} from './error.abstract';

export class DbmsQueryError extends ErrorAbstract {
    constructor(message: string, queryError: string) {
        super(`${message}.\n\nDBMS query error:\n${queryError}\n`);
    }
}
