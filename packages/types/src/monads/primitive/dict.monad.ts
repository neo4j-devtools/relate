import {entries, join, map, reduce} from 'lodash';

import Monad from '../monad';
import List from './list.monad';
import Maybe from './maybe.monad';

type RawDict<K, V> = Map<K, V>;
// @todo: not sure Extract<> is the right approach
// @ts-ignore
type KeyVal<T> = T extends Map<infer K, infer V>
    ? {key: K; value: V}
    : {
          key: Extract<keyof T, string | Symbol>;
          value: T[Extract<keyof T, string | Symbol>];
      };

// @ts-ignore
export default class Dict<T = any, K = KeyVal<T>['key'], V = KeyVal<T>['value']> extends Monad<RawDict<K, V>> {
    protected ourKeys: Maybe<List<K>> = Maybe.of();
    protected ourValues: Maybe<List<V>> = Maybe.of();

    constructor(private readonly ourOriginal: RawDict<K, V>) {
        super(ourOriginal);
    }

    get keys(): List<K> {
        if (this.ourKeys.isEmpty) {
            this.ourKeys = Maybe.from(List.from<K>(this.ourOriginal.keys()));
        }

        return this.ourKeys.getOrElse(List.of<K>([]));
    }

    get values(): List<V> {
        if (this.ourValues.isEmpty) {
            this.ourValues = Maybe.from(List.from<V>(this.ourOriginal.values()));
        }

        return this.ourValues.getOrElse(List.of<V>([]));
    }

    get isEmpty(): boolean {
        return this.keys.length.lessThanOrEqual(0);
    }

    static isDict<T>(val: any): val is Dict<T> {
        return val instanceof Dict;
    }

    static of<T>(val: T): Dict<T> {
        // @ts-ignore
        const sane = Array.isArray(val) ? val : entries(val);

        // @ts-ignore
        return new Dict<T>(new Map(sane));
    }

    static from<T, R = T extends Iterable<infer U> ? U : T>(val: R): Dict<R> {
        return Dict.isDict<R>(val) ? val : Dict.of<R>(val);
    }

    static fromObject<T>(obj: T) {
        return Dict.of<T>(obj);
    }

    hasKey(index: number): boolean {
        return index >= 0 && this.keys.length.lessThan(index);
    }

    getKey(index: number): Maybe<K> {
        return this.keys.nth(index);
    }

    hasValue(key: K): boolean {
        return this.ourOriginal.has(key);
    }

    // @ts-ignore
    getValue<O extends K = K, R = T[O]>(key: O): Maybe<R> {
        // @ts-ignore
        return Maybe.from<R>(this.ourOriginal.get(key));
    }

    toString(): string {
        return `{${join(
            map([...this], ([key, val]) => `${key}: ${val}`),
            ', ',
        )}}`;
    }

    toList(): List<[K, V]> {
        return List.from<[K, V]>(this.ourOriginal.entries());
    }

    toJSON(): any {
        const asObj = reduce(
            [...this],
            (agg, [key, val]) => ({
                ...agg,
                [`${key}`]: val,
            }),
            {},
        );

        return JSON.parse(JSON.stringify(asObj));
    }
}
