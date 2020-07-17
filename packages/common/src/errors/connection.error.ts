import {join, map} from 'lodash';
import {Str} from '@relate/types';

import {ErrorAbstract} from './error.abstract';

export class ConnectionError extends ErrorAbstract {
    constructor(message: string, errors: (string | Str)[] = []) {
        super(
            `${message}:\n\n${join(
                map(errors, (error) => `- ${error}`),
                '\n',
            )}`,
        );
    }
}
