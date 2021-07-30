import Monad from '../monad';
import None from './none.monad';
import Nil from './nil.monad';

/**
 * @noInheritDoc
 * @description
 * Represents a potentially "empty" value (if value is null | undefined | Nil | None)
 * ```ts
 * Maybe.of('').isEmpty // false
 * Maybe.of(Bool.FALSE).isEmpty // false
 * Maybe.of(false).isEmpty // false
 * Maybe.of(null).isEmpty // true
 * Maybe.of(Nil).isEmpty // true
 * Maybe.of(None).isEmpty // true
 * Maybe.of(List.from()).isEmpty // false
 * Maybe.of(List.from([1)).isEmpty // false
 * ```
 */
export default class Maybe<T> extends Monad<T | None<T>> {
    static EMPTY = new Maybe(None.EMPTY);

    /**
     * @hidden
     */
    constructor(val?: T | None) {
        // @ts-ignore
        super(val);
    }

    /**
     * Indicates if wrapped value is null | undefined | Nil | None
     *
     * ```ts
     * Maybe.of('').isEmpty // false
     * Maybe.of(Bool.FALSE).isEmpty // false
     * Maybe.of(false).isEmpty // false
     * Maybe.of([]).isEmpty // false
     * Maybe.of(null).isEmpty // true
     * Maybe.of(Nil).isEmpty // true
     * Maybe.of(None).isEmpty // true
     * Maybe.of(List.from()).isEmpty // false
     * Maybe.of(List.from([1)).isEmpty // false
     * ```
     */
    get isEmpty() {
        return (
            this.original === undefined ||
            this.original === null ||
            None.isNone(this.original) ||
            Nil.isNil(this.original)
        );
    }

    static isMaybe<T>(val: any): val is Maybe<T> {
        return val instanceof Maybe;
    }

    /**
     * @hidden
     */
    map<R = T extends None<infer E> ? E : T>(project: (value: R) => R): this {
        if (this.isEmpty) {
            return this;
        }

        // @ts-ignore
        return new this.constructor(project(this.original));
    }

    /**
     * Wraps passed value in Maybe regardless of what it is
     *
     * ```ts
     * const maybeString: Maybe<'foo'> = Maybe.of('foo');
     * maybeString.isEmpty // false
     * maybeString.get() // 'foo'
     *
     * const maybeEmptyList: Maybe<List<string>> = Maybe.of(List.from([]));
     * maybeEmptyList.isEmpty // false
     * maybeEmptyList.get() // List<never>
     *
     * const maybeEmptyList: Maybe<Maybe<string>> = Maybe.of(maybeString);
     * maybeEmptyList.isEmpty // false
     * maybeEmptyList.get() // Maybe<string>
     * ```
     */
    static of<T>(val?: T | None | Nil): Maybe<T> {
        if (None.isNone(val) || Nil.isNil(val)) {
            // @ts-ignore
            return Maybe.EMPTY;
        }

        if (val === undefined || val === null) {
            // @ts-ignore
            return Maybe.EMPTY;
        }

        return new Maybe(val);
    }

    /**
     * Wraps passed value in Maybe, if not already a Maybe
     * @see {@link Maybe.of}
     */
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
