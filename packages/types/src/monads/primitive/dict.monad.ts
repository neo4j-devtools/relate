import {entries, join, map, reduce} from 'lodash';

import Monad from '../monad';
import {arrayHasItems} from '../../utils/array.utils';
import Maybe from './maybe.monad';
import Str from './str.monad';

export type RawDict<T = Monad<any>> = Map<string, T>

export default class Dict<T = Monad<any>> extends Monad<RawDict<T>> {
    protected readonly keys: readonly Str[];

    constructor(val: RawDict<T>) {
        super(val);

        // @todo: could be optimised
        this.keys = Object.freeze(map([...val.keys()], Str.of));
    }

    get isEmpty(): boolean {
        return arrayHasItems(this.keys);
    }

    static isDict<T = Monad<any>>(val: any): val is Dict<T> {
        return val instanceof Dict;
    }

    static of<T = Monad<any>>(val: any): Dict<T> {
        const sane: [string, T][] = Array.isArray(val)
            ? val
            : entries(val);

        return new Dict<T>(new Map(sane));
    }

    static from<T = Monad<any>>(val: any): Dict<T> {
        return Dict.isDict<T>(val)
            ? val
            : Dict.of<T>(val);
    }

    static fromObject<T = Monad<any>>(obj: object) {
        return Dict.of<T>(obj);
    }

    hasKey(index: number): boolean {
        return index >= 0 && index < this.keys.length;
    }

    getKey(index: number): Maybe<Str> {
        return Maybe.of<Str>(this.keys[index]);
    }

    hasValue(key: string): boolean {
        return this.original.has(key);
    }

    getValue(key: string): Maybe<T> {
        return Maybe.of(this.original.get(key));
    }

    toString(): string {
        return `{${join(map([...this.original.entries()], ([key, val]) => `${key}: ${val}`), ', ')}}`;
    }

    toJSON(): any {
        const asObj = reduce([...this.original.entries()], (agg, [key, val]) => ({
            ...agg,
            [key]: val
        }), {});

        return JSON.parse(JSON.stringify(asObj));
    }
}
