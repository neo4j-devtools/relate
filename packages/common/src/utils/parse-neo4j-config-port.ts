import {last, split} from 'lodash';

export function parseNeo4jConfigPort(port: string): number {
    return Number(last(split(port, ':')));
}
