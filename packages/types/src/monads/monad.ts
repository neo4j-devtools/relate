export interface IMonad<T> extends Iterable<T> {
    isEmpty: boolean;

    equals(other: IMonad<any>): boolean;

    get(): T | undefined;

    getOrElse(other: T): T;

    toString(formatter?: (val: T) => string): string

    map(project: (value: T) => T): IMonad<T>;

    flatMap<M extends IMonad<any> = Monad<any>>(project: (value: T) => M): M;
}

export default class Monad<T extends any> implements IMonad<T> {
    protected alreadyIterable = false;
    protected iterableValue: Iterable<T> = [];

    constructor(protected readonly original: T) {
        // @ts-ignore
        this.alreadyIterable = original != null && typeof original !== 'string' && typeof original[Symbol.iterator] === 'function';
        // @ts-ignore
        this.iterableValue = this.alreadyIterable
            ? original
            : [original];
    }

    isThis(other?: any): other is this {
        return other instanceof this.constructor;
    }

    get isEmpty() {
        return this.original == null;
    }

    static isMonad<T extends any>(val: any): val is Monad<T> {
        return val instanceof Monad;
    }

    static of(val: any) {
        return new Monad(val);
    }

    static from(val: any) {
        return val instanceof Monad
            ? val
            : Monad.of(val);
    }

    * [Symbol.iterator](): Iterator<T> {
        for (const val of this.iterableValue) {
            yield val;
        }
    }

    get() {
        return this.original;
    }

    getOrElse(other: T): T {
        return this.isEmpty
            ? other
            : this.get();
    }

    equals(other: IMonad<any>) {
        if (other.constructor !== this.constructor) {
            return false;
        }

        return other.get() === this.get();
    }

    map(project: (value: T) => T): this {
        // @ts-ignore
        return new this.constructor(project(this.original));
    }

    flatMap<M extends IMonad<any> = Monad<any>>(project: (value: T) => M): M {
        return project(this.original);
    }

    switchMap<M extends IMonad<any> = Monad<any>>(project: (value: this) => M): M {
        return project(this);
    }

    toString() {
        return `${this.original}`;
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.original));
    }

    valueOf() {
        return this.original;
    }
}
