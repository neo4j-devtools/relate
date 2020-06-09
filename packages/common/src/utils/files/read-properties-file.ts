import {readFile} from 'fs-extra';
import {split, map, join, trim} from 'lodash';
import {NEW_LINE, PROPERTIES_SEPARATOR} from '../../constants';

// one day typescript will finally understand tuples
export type PropertyEntries = [string, string][];

export async function readPropertiesFile(path: string): Promise<PropertyEntries> {
    const conf = await readFile(path, 'utf8');
    const lines = map(split(conf, NEW_LINE), trim);

    return map(lines, (line): [string, string] => {
        const [key, ...rest] = split(line, PROPERTIES_SEPARATOR);

        return [key, join(rest, PROPERTIES_SEPARATOR)];
    });
}
