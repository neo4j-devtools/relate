import {arrayHasItems} from '../utils';
import {join, map} from 'lodash';

export class GraphqlError extends Error {
    constructor(message: string, errors: string[] = []) {
        super(
            /* eslint-disable indent */
            arrayHasItems(errors)
                ? `${message}.\n\nErrors(s):\n${join(
                      map(errors, (action) => `- ${action}`),
                      '\n',
                  )}`
                : message,
            /* eslint-enable indent */
        );
    }
}
