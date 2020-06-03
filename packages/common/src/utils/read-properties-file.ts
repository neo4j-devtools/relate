import {readFile} from 'fs-extra';
import {filter, split, map, trim, join} from 'lodash';
import {NEW_LINE, PROPERTIES_SEPARATOR} from '../constants';

export async function readPropertiesFile(path: string): Promise<Map<string, string>> {
    const conf = await readFile(path, 'utf8');
    const lines = map(split(conf, NEW_LINE), trim);

    return new Map<string, string>(
        map(filter(lines, Boolean), (line): [string, string] => {
            const [key, ...rest] = split(line, PROPERTIES_SEPARATOR);

            return [key, join(rest, '=')];
        }),
    );
}
