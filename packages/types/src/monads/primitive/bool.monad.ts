import Monad from '../monad';

export default class Bool extends Monad<boolean> {
    static TRUE = new Bool(true);
    static FALSE = new Bool(false);

    constructor(value = false) {
        super(value);
    }

    get isEmpty() {
        return false;
    }

    static isBool(val: any): val is Bool {
        return val instanceof Bool;
    }

    static of(val: any): Bool {
        return Boolean(val)
            ? Bool.TRUE
            : Bool.FALSE;
    }

    static from(val: any): Bool {
        return val instanceof Bool
            ? val
            : Bool.of(val);
    }
}
