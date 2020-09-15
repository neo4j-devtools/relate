import {isIterable} from '../utils/iterable.utils';

export interface IMonad<T> extends Iterable<T> {
    isEmpty: boolean;

    isThis(other?: any): other is this;

    equals(other: IMonad<any>): boolean;

    get(): T | undefined;

    getOrElse(other: T): T;

    toString(formatter?: (val: T) => string): string;

    map(project: (value: T) => T): IMonad<T>;

    tap(project: (value: T) => void): this;

    flatMap<M>(project: (value: T) => M): M;

    switchMap<M>(project: (value: this) => M): M;
}

/**
 * @description
 * The base implementation for all Monadic types.
 *
 * If you just want to access the plain JS value, use `.get()`:
 * ```ts
 * const monad: Monad<number> = Monad.from(10);
 * const plain: number | undefined = monad.get();
 * ```
 */
export default class Monad<T> implements IMonad<T> {
    protected readonly alreadyIterable: boolean = false;

    protected readonly iterableValue: Iterable<T>;

    /**
     * @hidden
     */
    constructor(protected readonly original: T) {
        this.alreadyIterable = isIterable(original);
        // @ts-ignore
        this.iterableValue = this.alreadyIterable ? original : [original];
    }

    /**
     * Indicates if passed value is an instance of `this`
     * ```ts
     * if (ours.isThis(other)) {
     *     // is instance of same constructor
     * }
     * ```
     */
    isThis(val?: any): val is this {
        return val instanceof this.constructor;
    }

    /**
     * Indicates if Monad lacks a value
     */
    get isEmpty(): boolean {
        return !this.original;
    }

    /**
     * Indicates if passed value is an instance of `Monad`
     * ```ts
     * if (Monad.isMonad(val)) {
     *     // is a monad
     * }
     * ```
     */
    static isMonad<T>(val: any): val is Monad<T> {
        return val instanceof Monad;
    }

    /**
     * Wraps passed value in monad regardless of what it is
     * ```ts
     * const strMonad: Monad<'foo'> = Monad.of('foo');
     * const strMonadMonad: Monad<Monad<'foo'>> = Monad.of(Monad.of('foo'));
     * ```
     */
    static of(val: any): Monad<any> {
        return new Monad<any>(val);
    }

    /**
     * Wraps passed value in monad, if not already a Monad
     * ```ts
     * const strMonad: Monad<'foo'> = Monad.from('foo');
     * const strMonadAgain: Monad<'foo'> = Monad.from(Monad.of('foo'));
     * ```
     */
    static from(val: any): Monad<any> {
        return Monad.isMonad<any>(val) ? val : Monad.of(val);
    }

    /**
     * @hidden
     */
    *[Symbol.iterator](): Iterator<T> {
        for (const val of this.iterableValue) {
            yield val;
        }
    }

    /**
     * Get raw value of monad
     */
    get() {
        return this.original;
    }

    /**
     * Get raw value of monad if not empty, else use other
     * ```ts
     * const otherWhenNotEmpty: 'foo' = Monad.of('foo').getOrElse('bar');
     * const otherWhenEmpty: 'bar' = Monad.of('').getOrElse('bar');
     * const throwWhenEmpty: never = Monad.of('').getOrElse(() => {
     *     throw new Error('empty');
     * });
     * ```
     */
    getOrElse(other: T | (() => T)): T {
        if (!this.isEmpty) {
            return this.get();
        }
        // @ts-ignore
        return typeof other === 'function' ? other() : other;
    }

    /**
     * Checks if other has the same raw value
     */
    equals(other: any): boolean {
        const toCompare = Monad.from(other);

        return toCompare.get() === this.get();
    }

    /**
     * Access value without modifying it. Useful when all you need is to log etc.
     * ```ts
     * const foo: Monad<'foo'> = Monad.from('foo');
     * const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
     * ```
     */
    tap(project: (value: T) => void): this {
        project(this.original);

        return this;
    }

    /**
     * Modify monad value without changing the type.
     * ```ts
     * const foo: Monad<'foo'> = Monad.from('foo');
     * const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
     * ```
     */
    map(project: (value: T) => T): this {
        if (this.isEmpty) {
            return this;
        }
        // @ts-ignore
        return new this.constructor(project(this.original));
    }

    /**
     * Unpack monad value and return anything.
     * ```ts
     * const foo: Monad<'foo'> = Monad.from('foo');
     * const fooBar: 'foo bar' = foo.flatMap((val) => `${val} bar`);
     * ```
     */
    flatMap<M>(project: (value: T) => M): M {
        return project(this.original);
    }

    /**
     * Switch monad for Iterable (of any type).
     * ```ts
     * const foo: Monad<'foo'> = Monad.from('foo');
     * const fooBar: Num<3> = foo.switchMap((val: Str) => Num.from(val.length));
     * ```
     */
    switchMap<M>(project: (value: this) => M): M {
        return project(this);
    }

    /**
     * When calling `.toString()`
     */
    toString(): string {
        return `${this.original}`;
    }

    /**
     * When calling `.toJSON()`
     */
    toJSON(): any {
        return JSON.parse(JSON.stringify(this.original));
    }

    /**
     * When calling `.valueOf()`
     */
    valueOf(): T {
        return this.original;
    }
}
