import Monad from '../monad';

export default class Nil extends Monad<null> {
    static NULL = new Nil();

    constructor(_?: any) {
        super(null);
    }

    get isEmpty() {
        return false;
    }

    static isNil(val: any): val is Nil {
        return val instanceof Nil;
    }

    static of(_?: any): Nil {
        return Nil.NULL;
    }

    static from(_?: any): Nil {
        return Nil.NULL;
    }
}
