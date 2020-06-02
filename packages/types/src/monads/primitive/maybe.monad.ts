import Monad from '../monad';
import None from './none.monad';
import Nil from './nil.monad';

// @ts-ignore
export default class Maybe<T> extends Monad<T | None<T>> {
    static EMPTY = new Maybe(None.EMPTY);

    constructor(val?: T | None) {
        // @ts-ignore
        super(val);
    }

    get isEmpty() {
        return !Monad.isMonad(this.original) || None.isNone(this.original) || Nil.isNil(this.original);
    }

    static isMaybe<T>(val: any): val is Maybe<T> {
        return val instanceof Maybe;
    }

    static of<T>(val?: T | None): Maybe<T> {
        // @ts-ignore
        return val !== undefined && val !== null && !None.isNone(val) && !Nil.isNil(val) ? new Maybe<T>(val) : Maybe.EMPTY;
    }

    static from<T>(val?: T): Maybe<T> {
        return Maybe.isMaybe<T>(val) ? val : Maybe.of<T>(val);
    }

    getOrElse<M = T, R = T extends null ? M : T>(other: M): R {
        // @ts-ignore
        return super.getOrElse(other);
    }

    toString(): string {
        return `${this.constructor.name} {${this.original}}}`;
    }
}
