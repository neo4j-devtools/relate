import Monad from '../monad';

// @ts-ignore
export default class Str<T extends string = string> extends Monad<T> {
    static EMPTY = new Str('');

    constructor(value = '') {
        // @ts-ignore
        super(value);
    }

    get isEmpty() {
        return typeof this.original !== 'string' || this.original.length === 0;
    }

    static isStr<T extends string = string>(val: any): val is Str<T> {
        return val instanceof Str;
    }

    static of<T extends string = string>(val: T): Str<T> {
        // @ts-ignore
        return new Str<T>(val !== undefined ? String(val) : '');
    }

    // @ts-ignore
    static from<T = any>(val: any): Str<T> {
        return val instanceof Str ? val : Str.of(val);
    }

    test(regex: RegExp): boolean {
        return regex.test(this.get());
    }
}
