import {readFile} from 'fs-extra';
import {split, map, trim} from 'lodash';
import {NEW_LINE, PROPERTIES_SEPARATOR} from '../constants';

export async function readPropertiesFile(path: string): Promise<Map<string, string>> {
    const conf = await readFile(path, 'utf8');
    const lines = map(split(conf, NEW_LINE), trim);

    return new Map<string, string>(
        map(lines, (line): [string, string] => {
            const [key, val = ''] = split(line, PROPERTIES_SEPARATOR);

            return [key, val];
        }),
    );
}
