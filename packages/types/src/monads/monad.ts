import {isIterable} from '../utils/iterable.utils';

export interface IMonad<T> extends Iterable<T> {
    isEmpty: boolean;

    isThis(other?: any): other is this;

    equals(other: IMonad<any>): boolean;

    get(): T | undefined;

    getOrElse(other: T): T;

    toString(formatter?: (val: T) => string): string;

    map(project: (value: T) => T): IMonad<T>;

    flatMap<M>(project: (value: T) => M): M;
}

export default class Monad<T> implements IMonad<T> {
    protected alreadyIterable = false;
    protected readonly iterableValue: Iterable<T>;

    constructor(protected readonly original: T) {
        this.alreadyIterable = isIterable(original);
        // @ts-ignore
        this.iterableValue = this.alreadyIterable ? original : [original];
    }

    isThis(other?: any): other is this {
        return other instanceof this.constructor;
    }

    get isEmpty(): boolean {
        return !this.original;
    }

    static isMonad<T>(val: any): val is Monad<T> {
        return val instanceof Monad;
    }

    static of<T>(val: T): Monad<T> {
        return new Monad<T>(val);
    }

    static from<T>(val: T): Monad<T> {
        return Monad.isMonad<T>(val) ? val : Monad.of<T>(val);
    }

    *[Symbol.iterator](): Iterator<T> {
        for (const val of this.iterableValue) {
            yield val;
        }
    }

    get() {
        return this.original;
    }

    getOrElse(other: T): T {
        return this.isEmpty ? other : this.get();
    }

    equals(other: any): boolean {
        const toCompare = Monad.from(other);

        return toCompare.get() === this.get();
    }

    tap(project: (value: T) => void): this {
        project(this.original);

        return this;
    }

    map(project: (value: T) => T): this {
        // @ts-ignore
        return new this.constructor(project(this.original));
    }

    flatMap<M>(project: (value: T) => M): M {
        return project(this.original);
    }

    switchMap<M extends IMonad<any> = Monad<any>>(project: (value: this) => M): M {
        return project(this);
    }

    toString(): string {
        return `${this.original}`;
    }

    toJSON(): string {
        return JSON.parse(JSON.stringify(this.original));
    }

    valueOf(): T {
        return this.original;
    }
}
