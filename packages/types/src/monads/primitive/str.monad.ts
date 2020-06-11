import {includes, replace, split} from 'lodash';

import Monad from '../monad';
import List from './list.monad';

/**
 * @noInheritDoc
 * @description
 * Represents a String value
 *
 * If you just want to access the plain JS value, use `.get()`:
 * ```ts
 * const str: Str = Str.from(true);
 * const plain: 'true' = str.get();
 * ```
 */
// @ts-ignore
export default class Str<T extends string = string> extends Monad<T> {
    static EMPTY = new Str('');

    /**
     * @hidden
     */
    constructor(value = '') {
        // @ts-ignore
        super(value);
    }

    /**
     * Returns true if value is empty string
     */
    get isEmpty() {
        return typeof this.original !== 'string' || this.original.length === 0;
    }

    /**
     * Indicates if passed value is an instance of `Str`
     * ```ts
     * if (Str.isStr(val)) {
     *     // is a Str
     * }
     * ```
     */
    static isStr<T extends string = string>(val: any): val is Str<T> {
        return val instanceof Str;
    }

    /**
     * Returns Str representation of the passed value.
     *
     * ```ts
     * const strBool: Str<'true'> = Str.of(true);
     *
     * const strMonad: Monad<'foo'> = Monad.from('foo');
     * const strBool: Str<'foo'> = Str.of(strMonad);
     *
     * const strBool: Str<'1,2,3'> = Str.of([1,2,3]);
     *
     * const listMonad: List<string> = List.from([1,2,3]);
     * const listBool: Str<'1,2,3'> = Str.of(listMonad);
     * ```
     */
    static of<T extends string = string>(val: T): Str<T> {
        return new Str<T>(String(val));
    }

    /**
     * Coerces anything into a Str
     * @see {@link Str.of}
     */
    // @ts-ignore
    static from<T = any>(val?: any): Str<T> {
        return val instanceof Str ? val : Str.of(val !== undefined ? val : '');
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
