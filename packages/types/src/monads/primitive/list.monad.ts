import {join, filter, find, map} from 'lodash';

import Monad from '../monad';
import Maybe from './maybe.monad';
import Num from './num/num.monad';
import None from './none.monad';

import {isIterable} from '../../utils/iterable.utils';
import Nil from './nil.monad';

type Compactable<T> = T extends null ? never : T
    | T extends Nil ? never : T
    | T extends None<any> ? never : T;

export default class List<T> extends Monad<Iterable<T>> {
    // @ts-ignore
    protected iterableValue: Iterable<T>;
    protected ourFirst?: Maybe<T>;
    protected ourLast?: Maybe<T>;
    protected ourPrivateLength = Maybe.of<Num>();

    get ourLength(): Num {
        if (this.ourPrivateLength.isEmpty) {
            this.ourPrivateLength = Maybe.from(Num.of([...this].length));
        }

        return this.ourPrivateLength.getOrElse(Num.ZERO);
    }

    get isEmpty(): boolean {
        return this.ourLength.equals(Num.ZERO);
    }

    get length(): Num {
        return this.ourLength;
    }

    get first(): Maybe<T> {
        if (this.ourFirst) {
            return this.ourFirst;
        }

        const it = this[Symbol.iterator]();

        this.ourFirst = Maybe.of(it.next().value);

        return this.ourFirst!;
    }

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

    get last(): Maybe<T> {
        if (this.ourLast) {
            return this.ourLast;
        }

        const arr = [...this].reverse();

        this.ourLast = Maybe.of(arr[0]);

        return this.ourLast!;
    }

    static isList<T>(val: any): val is List<T> {
        return val instanceof List;
    }

    static of<T>(val: Iterable<T>): List<T> {
        const sane: Iterable<T> = isIterable(val) ? val : Array.of(val);

        return new List(sane);
    }

    static from<T>(val?: Iterable<T> | null): List<T> {
        if (!val) {
            return List.of<T>([]);
        }

        return List.isList<T>(val) ? val : List.of(val);
    }

    // @ts-ignore
    *[Symbol.iterator](): Iterator<T> {
        for (const val of this.iterableValue) {
            yield val;
        }
    }

    hasIndex(index: Num | number): boolean {
        const numToUse = Num.fromValue(index);

        return numToUse.greaterThanOrEqual(Num.ZERO) && numToUse.lessThan(this.ourLength);
    }

    find(predicate: (val: T) => boolean): Maybe<T> {
        const found = find([...this], predicate);

        return Maybe.of<T>(found);
    }

    filter(predicate: (val: T) => boolean): List<T> {
        const found = filter([...this], predicate);

        return List.of<T>(found);
    }

    // @todo: extend typing for empty monads
    compact<R = Compactable<T>>(): List<R> {
        // @ts-ignore
        return this.filter((v) => {
            return v !== null && !Nil.isNil(v) && !None.isNone(v);
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

    mapEach<M = T>(project: (val: T) => M): List<M> {
        return List.from(map([...this], project))
    }

    indexOf(val: T): Num {
        const valToUse = Monad.from(val);
        let i = 0;

        for (const item of this) {
            if (valToUse.equals(item)) {
                return Num.from(i);
            }
        }

        return Num.from(-1);
    }

    slice(from: Num | number, to?: Num | number): List<T> {
        const fromToUse = Num.fromValue(from);
        const toToUse = to ? Num.fromValue(to) : None.of<Num>();
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

    concat(other: T | Iterable<T>): List<T> {
        return isIterable(other)
            ? List.of<T>([...this, ...other])
            : List.of<T>([...this, other]);
    }

    toString() {
        return `[${join([...this.original], ', ')}]`;
    }

    toArray() {
        return [...this];
    }

    // @todo: should we create an AsyncList instead?
    async awaitAll<R = T extends PromiseLike<infer V> ? V : T>(): Promise<List<R>> {
        // @ts-ignore
        return List.of<R>(await Promise.all(this));
    }
}
