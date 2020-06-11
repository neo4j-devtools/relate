import Monad from '../monad';

/**
 * @noInheritDoc
 * @description
 * Represents a Boolean value
 *
 * If you just want to access the plain JS value, use `.get()`:
 * ```ts
 * const bool: Bool = Bool.from(true);
 * const plain: boolean = bool.get();
 * ```
 */
// @ts-ignore
export default class Bool extends Monad<boolean> {
    static TRUE = new Bool(true);

    static FALSE = new Bool(false);

    /**
     * @hidden
     */
    constructor(value = false) {
        super(value);
    }

    /**
     * Bool is never empty
     */
    get isEmpty(): false {
        return false;
    }

    /**
     * Indicates if passed value is an instance of `Bool`
     * ```ts
     * if (Bool.isBool(val)) {
     *     // is a Bool
     * }
     * ```
     */
    static isBool(val: any): val is Bool {
        return val instanceof Bool;
    }

    /**
     * Returns a Bool representing if passed value is "empty".
     *
     * ```ts
     * const strBool: Bool<true> = Bool.of('foo');
     * const strBool: Bool<false> = Bool.of('');
     *
     * const strMonad: Monad<'foo'> = Monad.from('foo');
     * const strBool: Bool<true> = Bool.of(strMonad);
     *
     * const strMonad: Monad<''> = Monad.from('');
     * const strBool: Bool<false> = Bool.of(strMonad);
     *
     * const listMonad: List<string> = List.from(['']);
     * const listBool: Bool<true> = Bool.of(listMonad);
     *
     * const listMonad: List<string> = List.from([]);
     * const listBool: Bool<false> = Bool.of(listMonad);
     * ```
     */
    static of(val: any): Bool {
        const valToUse = Monad.from(val);

        return valToUse.isEmpty ? Bool.FALSE : Bool.TRUE;
    }

    /**
     * Coerces anything into a Bool
     * @see {@link Bool.of}
     */
    static from(val: any): Bool {
        return val instanceof Bool ? val : Bool.of(val);
    }
}
