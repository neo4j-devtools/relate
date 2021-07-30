import {chunk, join, filter, find, map, forEach, without, uniq, uniqBy, ArrayIterator} from 'lodash';

import Monad from '../monad';
import Maybe from './maybe.monad';
import Num from './num.monad';
import None from './none.monad';

import {isIterable} from '../../utils/iterable.utils';
import Nil from './nil.monad';
import Str from './str.monad';

/**
 * @noInheritDoc
 * @description
 * Represents any Iterable value (i.e Array, String, Map, Set, etc.)
 *
 * If you just want to access the plain JS value, use `.get()` or `.toArray()`:
 * ```ts
 * const list: List<string> = List.from('foo');
 * const plain: 'foo' = list.get();
 * const asArr: ['f', 'o', 'o'] = list.toArray();
 *
 * const list: List<number> = List.from([1,2,3]);
 * const plain: [1,2,3] = list.get();
 * const asArr: [1,2,3] = list.toArray();
 * ```
 */
export default class List<T> extends Monad<Iterable<T>> {
    // @ts-ignore
    protected iterableValue: Iterable<T>;

    protected ourFirst?: Maybe<T>;

    protected ourLast?: Maybe<T>;

    protected ourPrivateLength = Maybe.of<Num>();

    protected get ourLength(): Num {
        if (this.ourPrivateLength.isEmpty) {
            this.ourPrivateLength = Maybe.from(Num.of([...this].length));
        }

        return this.ourPrivateLength.getOrElse(Num.ZERO);
    }

    /**
     * List are empty if length is zero
     */
    get isEmpty(): boolean {
        return this.ourLength.equals(Num.ZERO);
    }

    get length(): Num {
        return this.ourLength;
    }

    /**
     * Returns a {@link Maybe} of the first element in the sequence
     */
    get first(): Maybe<T> {
        if (this.ourFirst) {
            return this.ourFirst;
        }

        const it = this[Symbol.iterator]();

        this.ourFirst = Maybe.of(it.next().value);

        return this.ourFirst!;
    }

    /**
     * Returns a {@link Maybe} of the nth element in the sequence
     */
    nth(index: number | string | Num): Maybe<T> {
        const indexToUse = Num.from(index);
        let i = 0;

        for (const item of this) {
            if (indexToUse.equals(i)) {
                return Maybe.from<T>(item);
            }

            i += 1;
        }

        return Maybe.of<T>();
    }

    /**
     * Returns a {@link Maybe} of the last element in the sequence
     */
    get last(): Maybe<T> {
        if (this.ourLast) {
            return this.ourLast;
        }

        const arr = [...this].reverse();

        this.ourLast = Maybe.of(arr[0]);

        return this.ourLast!;
    }

    /**
     * Indicates if passed value is an instance of `List`
     * ```ts
     * if (List.isList(val)) {
     *     // is a List
     * }
     * ```
     */
    static isList<T = any>(val: any): val is List<T> {
        return val instanceof List;
    }

    /**
     * Returns a List representing the passed value as an Iterable.
     *
     * ```ts
     * const strList: List<string> = List.of('foo');
     * List.get(); // ['f', 'o', 'o']
     *
     * const boolList: List<boolean> = List.of(true);
     * List.get(); // [true]
     *
     * const listMonad: List<string> = List.from(['']);
     * List.get(); // ['']
     *
     * const listMonad: List<string> = List.from([]);
     * const listList: List<false> = List.of(listMonad);
     * ```
     */
    static of<T>(val: Iterable<T>): List<T> {
        const sane: Iterable<T> = isIterable(val) ? val : Array.of(val);

        return new List(sane);
    }

    /**
     * Coerces any value to a List, if not one already
     * @see {@link List.of}
     */
    static from<T>(val?: Iterable<T> | null): List<T> {
        if (!val) {
            return List.of<T>([]);
        }

        return List.isList<T>(val) ? val : List.of(Array.from(val));
    }

    /**
     * Creates an List of Nones of a given length
     * @see {@link List.of}
     */
    static ofLength<T>(length: number | Num): List<None<T>> {
        return Num.from(length).flatMap((n) => List.from(Array(n).fill(None.EMPTY)));
    }

    /**
     * @hidden
     */
    // @ts-ignore
    *[Symbol.iterator](): Iterator<T> {
        for (const val of this.iterableValue) {
            yield val;
        }
    }

    hasIndex(index: Num | number): boolean {
        const numToUse = Num.from(index);

        return numToUse.greaterThanOrEqual(Num.ZERO) && numToUse.lessThan(this.ourLength);
    }

    find(predicate: (val: T) => boolean): Maybe<T> {
        const found = find([...this], predicate);

        return Maybe.of<T>(found);
    }

    includes(other: T): boolean {
        const valToUse = Monad.from(other);

        // this could be a bug since maybe now considers null empty
        return !this.find((val) => valToUse.equals(val)).isEmpty;
    }

    filter(predicate: (val: T) => boolean): List<T> {
        const found = filter([...this], predicate);

        return List.of<T>(found);
    }

    without(...other: T[]): List<T> {
        return List.of<T>(without([...this], ...other));
    }

    /**
     * Remove all null, undefined, None, or Nil values (shallow)
     * ```ts
     * const listOfEmpties = List.from([[], 'foo', null, None])
     * const compacted = listOfEmpties.compact()
     * compacted.toArray() // [[], 'foo']
     * ```
     */
    compact<R extends Exclude<T, null | undefined | None<any> | Nil>>(): List<R> {
        // @ts-ignore
        return this.filter((val) => {
            return val !== null && val !== undefined && !Nil.isNil(val) && !None.isNone(val);
        });
    }

    reduce<R = any>(cb: (agg: R, next: T, index: number) => R, seed: R): R {
        let result: R = seed;
        let index = -1;

        for (const item of this) {
            index += 1;
            result = cb(result, item, index);
        }

        return result;
    }

    /**
     * Map over each item in the List, modifying each value
     * @param   project   callback invoked for each item
     * ```ts
     * const start = List.from([1,2,3])
     * const end = start.mapEach((v) => v+1);
     * end.toArray() // [2,3,4]
     * ```
     */
    mapEach<M = T>(project: ArrayIterator<T, M>): List<M> {
        return List.from(map([...this], project));
    }

    /**
     * Iterate over each item in the List, without modifying value
     * @param   project   callback invoked for each item
     * ```ts
     * const start = List.from([1,2,3])
     * const end = start.forEach((v) => v+1);
     * end.toArray() // [1,2,3]
     * ```
     */
    forEach(project: ArrayIterator<T, any>): this {
        forEach([...this], project);

        return this;
    }

    indexOf(val: T): Num {
        const valToUse = Monad.from(val);
        let i = 0;

        for (const item of this) {
            if (valToUse.equals(item)) {
                return Num.from(i);
            }

            i += 1;
        }

        return Num.from(-1);
    }

    slice(from: Num | number, to?: Num | number): List<T> {
        const fromToUse = Num.from(from);
        const toToUse = to ? Num.from(to) : None.of<Num>();
        const it = this[Symbol.iterator]();
        const res = [];

        let current = it.next();
        let i = 0;

        while (!current.done && (None.isNone(toToUse) || toToUse.greaterThan(i))) {
            if (fromToUse.lessThanOrEqual(i)) {
                res.push(current.value);
            }

            i += 1;
            current = it.next();
        }

        // @ts-ignore
        return List.of([...res]);
    }

    concat<O extends Str<any>>(other: O): List<T | O>;

    concat<O extends string>(other: O): List<T | O>;

    concat<O, I = O extends Iterable<infer I> ? I : O>(other: O): List<T | I>;

    concat<O>(other: O): List<T | O> {
        if (isIterable(other) && List.isList(other)) {
            return List.of([...this, ...other]);
        }

        if (isIterable(other) && !Monad.isMonad(other)) {
            return List.of([...this, ...other]);
        }

        return List.of([...this, other]);
    }

    /**
     * Flattens all iterable items (shallow)
     * ```ts
     * const listOfLists = List.from([[], 'foo', [2], List.from(true)])
     * const flat = listOfLists.flatten()
     * flat.toArray() // ['f', 'o', 'o', 2, true]
     * ```
     */
    flatten<R = T extends List<infer I> ? I : T>(): List<R> {
        return this.reduce((agg, next) => agg.concat(next), List.from<R>([]));
    }

    sort(compareFn?: (a: T, b: T) => number): List<T> {
        return List.from([...this].sort(compareFn));
    }

    join(separator?: string | Str): Str {
        return Str.from(join([...this], separator ? `${separator}` : separator));
    }

    unique(predicate?: (val: T) => any) {
        if (predicate) {
            // @ts-ignore
            return this.map((val) => uniqBy(val, predicate));
        }

        // @ts-ignore
        return this.map(uniq);
    }

    chunk(size: number | Num = 1): List<List<T>> {
        const inChunks = chunk(this.toArray(), Num.from(size).getOrElse(1));

        return List.from(inChunks).mapEach(List.from);
    }

    toString() {
        return `[${this.join(', ')}]`;
    }

    toArray() {
        return [...this];
    }

    /**
     * Unwinds any promises in list (shallow), using Promise.all()
     *
     * ```ts
     * const listOfPromises = List.from(['foo', Promise.resolve(2), Promise.resolve([])])
     * const unwound = await listOfPromises.unwindPromises()
     * unwound.toArray() // ['foo', 2, []]
     * ```
     */
    async unwindPromises<R = T extends PromiseLike<infer V> ? V : T>(): Promise<List<R>> {
        // @ts-ignore
        return List.of<R>(await Promise.all(this));
    }
}
