import {entries, merge} from 'lodash';

import List from './list.monad';
import Maybe from './maybe.monad';
import {isIterable} from '../../utils/iterable.utils';
import Num from './num.monad';

type RawDict<K, V> = Map<K, V>;

// @todo: not sure Extract<> is the right approach
type KeyVal<T, Key extends keyof T = keyof T> = T extends Map<infer K, infer V>
    ? {key: K; value: V}
    : T extends List<[infer K, infer V]>
    ? {key: Extract<K, string | symbol>; value: V}
    : T extends List<Iterable<infer I>>
    ? {key: Extract<I, string | symbol>; value: I}
    : T extends Array<Array<infer I>>
    ? {key: Extract<I, string | symbol>; value: I}
    : {
          key: Extract<Key, string | symbol>;
          value: T[Extract<Key, string | symbol>];
      };

interface IAsObject<T = any> {
    // @ts-ignore
    [x: KeyVal<T>['key']]: KeyVal<T>['value'];
}

/**
 * @noInheritDoc
 * @description
 * Represents any Iterable value with named keys (i.e Object, Map)
 *
 * If you just want to access the plain JS value, use `.get()`, `.toObject()`, or `.toArray()`:
 * ```ts
 * const dict: Dict<{foo: 'bar'}> = Dict.from({foo: 'bar'});
 * const plain: {foo: 'bar'} = dict.get();
 * const asArr: [['foo', 'bar']] = dict.toArray();
 * const asObj: {foo: 'bar'} = dict.toObject();
 * ```
 */
// @ts-ignore
export default class Dict<T = any, K = KeyVal<T>['key'], V = KeyVal<T>['value']> extends List<RawDict<K, V>> {
    protected ourKeys: Maybe<List<K>> = Maybe.of();

    protected ourValues: Maybe<List<V>> = Maybe.of();

    /**
     * @hidden
     */
    constructor(private readonly ourOriginal: RawDict<K, V>) {
        // @ts-ignore
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

    /**
     * Dict is empty if it has zero keys
     */
    get isEmpty(): boolean {
        return this.keys.length.lessThanOrEqual(0);
    }

    /**
     * Indicates if passed value is an instance of `Dict`
     * ```ts
     * if (Dict.isDict(val)) {
     *     // is a Dict
     * }
     * ```
     */
    static isDict<T>(val: any): val is Dict<T> {
        return val instanceof Dict;
    }

    /**
     * Returns a Dict representing the passed value as a Map.
     *
     * ```ts
     * const empty = Dict.of([]);
     * empty.get() // Map<never, never>
     *
     * const arr = Dict.of([['foo', 'bar']);
     * arr.get() // Map<string, string>
     *
     * const list = Dict.of(List.of([['foo', 'bar']));
     * list.get() // Map<string, string>
     * ```
     */
    static of<T>(val: T): Dict<T> {
        // @ts-ignore
        const sane = isIterable(val) ? val : entries(val);

        // @ts-ignore
        return new Dict<T>(new Map(sane));
    }

    /**
     * Coerces any value to a Dict, if not one already
     * @see {@link Dict.of}
     */
    static from<T, R = Map<KeyVal<T>['key'], KeyVal<T>['value']>>(val?: T): Dict<R> {
        return Dict.isDict<R>(val) ? val : Dict.of(val || {});
    }

    /**
     * Checks if a key exists and a given index
     */
    hasIndex(index: number | Num): boolean {
        const indexToUse = Num.from(index);

        return indexToUse.greaterThanOrEqual(0) && this.keys.length.greaterThan(indexToUse);
    }

    /**
     * Gets key at index
     */
    getKey(index: number): Maybe<K> {
        const indexToUse = Num.from(index);

        return this.keys.nth(indexToUse);
    }

    /**
     * Checks if named key exists
     */
    hasKey(key: K): boolean {
        return this.ourOriginal.has(key);
    }

    /**
     * Gets value of named key
     */
    // @ts-ignore
    getValue<O extends K = K, R = KeyVal<T, O>['value']>(key: O): Maybe<R> {
        // @ts-ignore
        return Maybe.from<R>(this.ourOriginal.get(key));
    }

    toString(): string {
        return `{${this.toList()
            .mapEach(([key, val]) => `${key}: ${JSON.stringify(val)}`)
            .join(', ')}}`;
    }

    /**
     * Converts original value to it's Object representation
     */
    toObject<O extends T, R = O extends IAsObject<T> ? O : never>(): R {
        // @ts-ignore
        return this.toList().reduce(
            (agg, [key, val]) => ({
                ...agg,
                [`${key}`]: val,
            }),
            {},
        );
    }

    // @todo: these types can probably be done better
    omit<K2 extends keyof T, I = T extends object ? T : never, R = Dict<Omit<I, K2>>>(other: K2): R;

    omit<K2 extends KeyVal<T>['key'], I = T extends Map<K, V> ? T : never, R = Dict<T, Exclude<K, K2>, V>>(
        other: K2,
    ): R;

    /**
     * Omits a key from the Dict
     * ```ts
     * const fooBar = Dict.from({foo: true, bar: 1});
     * const foo = fooBar.omit('bar');
     * foo.toObject() // {foo: true}
     * ```
     */
    omit(other: any) {
        return this.toList()
            .filter(([key]) => key !== other)
            .switchMap(Dict.from);
    }

    merge<O extends object>(other: O): Dict<T & O>;

    /**
     * Merges two Dicts
     * ```ts
     * const foo = Dict.from({foo: true});
     * const bar = Dict.from({bar: 1});
     * const fooBar = foo.merge(bar);
     * fooBar.toObject() // {foo: true, bar: 1}
     * ```
     */
    merge<O extends Dict>(other: O): Dict<T & O> {
        // @ts-ignore
        return Dict.from(merge({}, this.toObject(), Dict.isDict(other) ? other.toObject() : other));
    }

    /**
     * Converts Dict to List
     * ```ts
     * const fooBar = Dict.from({foo: true, bar: 1});
     * fooBar.toList().toArray() // [["foo", true], ["bar", 1]]
     * ```
     */
    toList(): List<[K, V]> {
        return List.from<[K, V]>(this.ourOriginal.entries());
    }

    toJSON(): any {
        return JSON.parse(JSON.stringify(this.toObject()));
    }
}
