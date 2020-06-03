import {join, map} from 'lodash';

import {arrayHasItems} from '../utils/generic/array-has-items';

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
