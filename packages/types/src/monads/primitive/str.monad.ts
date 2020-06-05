import {includes, replace, split} from 'lodash';

import Monad from '../monad';
import List from './list.monad';

// @ts-ignore
export default class Str<T extends string = string> extends Monad<T> {
    static EMPTY = new Str('');

    constructor(value = '') {
        // @ts-ignore
        super(value);
    }

    get isEmpty() {
        return typeof this.original !== 'string' || this.original.length === 0;
    }

    static isStr<T extends string = string>(val: any): val is Str<T> {
        return val instanceof Str;
    }

    static of<T extends string = string>(val: T): Str<T> {
        // @ts-ignore
        return new Str<T>(val !== undefined ? String(val) : '');
    }

    // @ts-ignore
    static from<T = any>(val?: any): Str<T> {
        return val instanceof Str ? val : Str.of(val);
    }

    test(regex: RegExp): boolean {
        return regex.test(this.get());
    }

    includes(other: string | Str): boolean {
        return includes(`${this}`, `${other}`);
    }

    split(sep: string | Str): List<Str> {
        return List.from(split(`${this}`, `${sep}`)).mapEach(Str.from);
    }

    replace(pattern: string | RegExp | Str, replacement: string | Str): Str {
        return Str.from(replace(`${this}`, Str.isStr(pattern) ? `${pattern}` : pattern, `${replacement}`));
    }
}
