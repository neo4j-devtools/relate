import Monad from '../monad';

/**
 * @noInheritDoc
 * @description
 * Represents an null value
 *
 * If you just want to access the plain JS value, use `.get()`:
 * ```ts
 * const nil: Nil = Nil.from();
 * const plain: null = nil.get();
 * ```
 */
// @ts-ignore
export default class Nil extends Monad<null> {
    static NULL = new Nil();

    /**
     * @hidden
     */
    constructor(_?: any) {
        super(null);
    }

    /**
     * Nil is always empty
     */
    get isEmpty(): true {
        return true;
    }

    /**
     * Indicates if passed value is an instance of `Nil`
     * ```ts
     * if (Nil.isNil(val)) {
     *     // is a Nil
     * }
     * ```
     */
    static isNil(val: any): val is Nil {
        return val instanceof Nil;
    }

    /**
     * Returns a Nil, regardless of value.
     *
     * ```ts
     * const strNil: Nil = Nil.of('foo');
     * const addNil: Nil = Nil.of([]);
     *
     * const listMonad: List<string> = List.from(['']);
     * const listNil: Nil = Nil.of(listMonad);
     * ```
     */
    static of(_?: any): Nil {
        return Nil.NULL;
    }

    /**
     * @see {@link Nil.of}
     */
    static from(_?: any): Nil {
        return Nil.NULL;
    }
}
