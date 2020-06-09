import {ErrorAbstract} from './error.abstract';
import {TapestryJSONResponse} from '../entities/dbmss';

export class DbmsQueryError extends ErrorAbstract {
    constructor(message: string, failure: TapestryJSONResponse<any>) {
        super(
            `${message}:\n\n${failure.data.code}:\n${failure.data.message}\n`,
        );
    }
}
