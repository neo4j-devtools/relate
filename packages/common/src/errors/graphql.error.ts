import {List} from '@relate/types';

export class GraphqlError extends Error {
    constructor(message: string, errors: string[] | List<string> = []) {
        const asList = List.from(errors);

        super(
            /* eslint-disable indent */
            asList.isEmpty
                ? message
                : `${message}.\n\nErrors(s):\n${asList.mapEach((action) => `- ${action}`).join('\n')}`,
            /* eslint-enable indent */
        );
    }
}
