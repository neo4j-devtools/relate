import {writeFile} from 'fs-extra';
import {join, map, trim} from 'lodash';

import {NEW_LINE, PROPERTIES_SEPARATOR} from '../../constants';
import {PropertyEntries} from './read-properties-file';

export function writePropertiesFile(path: string, properties: PropertyEntries): Promise<void> {
    const asText = join(
        map(
            properties,
            ([key, val]) => {
                const nowhitespace = trim(val);

                return nowhitespace ? join([key, val], PROPERTIES_SEPARATOR) : key;
            },
        ),
        NEW_LINE,
    );

    return writeFile(path, asText, 'utf8');
}
