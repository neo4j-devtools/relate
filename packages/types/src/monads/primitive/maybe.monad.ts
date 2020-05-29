import Monad from '../monad';
import None from './none.monad';
import Nil from './nil.monad';

export default class Maybe<T = Monad<any>> extends Monad<T | None<T>> {
    static EMPTY = new Maybe(None.EMPTY);

    constructor(val?: T | None) {
        // @ts-ignore
        super(val);
    }

    get isEmpty() {
        return None.isNone(this.original) || Nil.isNil(this.original);
    }

    static isMaybe<T = Monad<any>>(val: any): val is Maybe<T> {
        return val instanceof Maybe;
    }

    static of<T = Monad<any>>(val?: T | None): Maybe<T> {
        // @ts-ignore
        return val !== undefined && !None.isNone(val)
            ? new Maybe<T>(val)
            : Maybe.EMPTY;
    }

    static from<T = Monad<any>>(val: any): Maybe<T> {
        return Maybe.isMaybe(val)
            ? val
            : Maybe.of(val);
    }

    getOrElse<M = T>(other: M): M {
        // @ts-ignore
        return super.getOrElse(other);
    }

    toString(): string {
        return `${this.constructor.name} {${this.original}}}`;
    }
}
