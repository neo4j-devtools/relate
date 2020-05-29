import Monad from '../monad';

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
        return new Str<T>(val !== undefined ? String(val) : '');
    }

    static from<T extends string = string>(val: any): Str<T> {
        return val instanceof Str
            ? val
            : Str.of(val);
    }
}
