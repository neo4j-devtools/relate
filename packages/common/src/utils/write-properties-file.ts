import {writeFile} from 'fs-extra';
import {filter, join, map} from 'lodash';

import {NEW_LINE, PROPERTIES_SEPARATOR} from '../constants';

export function writePropertiesFile(path: string, properties: Map<string, string>): Promise<void> {
    const asText = join(
        filter(
            map([...properties], (prop) => join(prop, PROPERTIES_SEPARATOR)),
            ([key]) => Boolean(key),
        ),
        NEW_LINE,
    );

    return writeFile(path, asText, 'utf8');
}
