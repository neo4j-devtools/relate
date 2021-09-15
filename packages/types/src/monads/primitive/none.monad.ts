import Monad from '../monad';

/**
 * @noInheritDoc
 * @description
 * Represents an undefined value
 *
 * If you just want to access the plain JS value, use `.get()`:
 * ```ts
 * const none: None = None.from();
 * const plain: undefined = none.get();
 * ```
 */
export default class None<T extends any = any> extends Monad<T> {
    static EMPTY = new None();

    /**
     * @hidden
     */
    constructor() {
        // @ts-ignore
        super(undefined);
    }

    /**
     * None is always empty
     */
    get isEmpty(): true {
        return true;
    }

    /**
     * Indicates if passed value is an instance of `None`
     * ```ts
     * if (None.isNone(val)) {
     *     // is a None
     * }
     * ```
     */
    static isNone<T extends any = any>(val: any): val is None<T> {
        return val instanceof None;
    }

    /**
     * Returns a None, regardless of value.
     *
     * ```ts
     * const strNone: None<string> = None.of('foo');
     * const addNone: None<never[]> = None.of([]);
     *
     * const listMonad: List<string> = List.from(['']);
     * const listNone: None<List<string>> = None.of(listMonad);
     * ```
     */
    static of<T extends any = any>(_?: any): None<T> {
        return None.EMPTY;
    }

    /**
     * @see {@link None.of}
     */
    static from<T extends any = any>(_?: any): None<T> {
        return None.EMPTY;
    }

    toString(): string {
        return `${this.constructor.name} {${this.original}}}`;
    }

    /**
     * None cannot be stringified
     */
    toJSON(): undefined {
        return undefined;
    }
}
