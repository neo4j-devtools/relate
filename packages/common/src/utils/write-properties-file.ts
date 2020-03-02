import {writeFile} from 'fs-extra';
import {filter, join, map, trim} from 'lodash';

import {NEW_LINE, PROPERTIES_SEPARATOR} from '../constants';

export function writePropertiesFile(path: string, properties: Map<string, string>): Promise<void> {
    const asText = join(
        map(
            filter([...properties], ([key]) => Boolean(trim(key))),
            ([key, val]) => {
                const nowhitespace = trim(val);

                return nowhitespace ? join([key, val], PROPERTIES_SEPARATOR) : key;
            },
        ),
        NEW_LINE,
    );

    return writeFile(path, asText, 'utf8');
}
