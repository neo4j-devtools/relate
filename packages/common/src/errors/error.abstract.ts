import {join, map} from 'lodash';

import {arrayHasItems} from '../utils/array-has-items';

export abstract class ErrorAbstract extends Error {
    constructor(message: string, actions: string[] = []) {
        super(
            /* eslint-disable indent */
            arrayHasItems(actions)
                ? `${message}.\n\nSuggested Action(s):\n${join(
                      map(actions, (action) => `- ${action}`),
                      '\n',
                  )}`
                : message,
            /* eslint-enable indent */
        );
    }
}
