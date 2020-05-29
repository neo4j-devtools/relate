import {join, find, findIndex} from 'lodash';

import Monad from '../monad';
import Maybe from './maybe.monad';
import Num from './num/num.monad';
import None from './none.monad';

export default class List<T extends Monad<any> = Monad<any>> extends Monad<T[]> {
    // @ts-ignore
    protected iterableValue: Iterable<T>;
    protected ourFirst?: Maybe<T>;
    protected ourLast?: Maybe<T>;
    protected readonly ourLength: Num;

    constructor(val: T[]) {
        // @ts-ignore
        super(val);

        this.ourLength = Num.of(val.length);
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

        // @ts-ignore
        this.ourFirst = Maybe.of(it.next().value);

        return this.ourFirst!;
    }

    get last(): Maybe<T> {
        if (this.ourLast) {
            return this.ourLast;
        }

        const arr = [...this].reverse();

        // @ts-ignore
        this.ourLast = Maybe.of(arr[0]);

        return this.ourLast!;
    }

    static isList<T extends Monad<any> = Monad<any>>(val: any): val is List<T> {
        return val instanceof List;
    }

    static of<T extends Monad<any> = Monad<any>>(val: any): List<T> {
        const sane: T[] = Array.isArray(val)
            ? val
            : Array.of(val);

        return new List(sane);
    }

    static from<T extends Monad<any> = Monad<any>>(val: any): List<T> {
        return List.isList<T>(val)
            ? val
            : List.of(val);
    }

    // @ts-ignore
    * [Symbol.iterator](): Iterator<T> {
        for (const val of this.iterableValue) {
            yield val;
        }
    }

    hasIndex(index: Num | number): boolean {
        const numToUse = Num.fromValue(index);

        return numToUse.greaterThanOrEqual(Num.ZERO) && numToUse.lessThan(this.original.length);
    }

    getIndex(index: Num | number): Maybe<T> {
        const numToUse = Num.fromValue(index);

        return Maybe.of(this.original[numToUse.get()]);
    }

    find(val: T): Maybe<T> {
        const found = find(this.original, (other) => val.equals(other));

        return Maybe.of<T>(
            val.isThis(found)
                ? found
                : None.EMPTY
        );
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

    indexOf(val: T): Num {
        const found = findIndex(this.original, (other) => val.equals(other));

        return Num.of(found);
    }

    slice<O extends Monad<any> = T>(from: Num | number, to?: Num | number): List<O> {
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

            i++;
            current = it.next();
        }

        // @ts-ignore
        return List.of([...res]);
    }

    concat(other: T | List<T> | Array<T>): List<T> {
        return List.isList(other) || Array.isArray(other)
            ? List.of<T>([...this, ...other])
            : List.of<T>([...this, other]);
    }

    toString() {
        return `[${join(this.original, ', ')}]`;
    }
}
