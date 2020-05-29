import Monad from '../../monad';
import {DEFAULT_NUM_RADIX, TWO_PWR_24_DBL, TWO_PWR_32_DBL} from './num.constants';
import {
    addNums,
    compareNums,
    divideNums,
    fromNumberToNum,
    fromNumToString,
    fromStringToNum,
    fromValueToNum,
    isCacheable,
    multiplyNum,
    shiftNumLeft,
    shiftNumRight
} from '../../../utils/num.utils';

export default class Num extends Monad<number> {
    static readonly INT_CACHE = new Map();
    static readonly ZERO = Num.fromInt(0);
    static readonly ONE = Num.fromInt(1);
    static readonly NEG_ONE = Num.fromInt(-1);
    static readonly MAX_VALUE = Num.fromBits(0xffffffff | 0, 0x7fffffff | 0);
    static readonly MIN_VALUE = Num.fromBits(0, 0x80000000 | 0);
    static readonly MIN_SAFE_VALUE = Num.fromBits(0x1 | 0, 0xffffffffffe00000 | 0);
    static readonly MAX_SAFE_VALUE = Num.fromBits(0xffffffff | 0, 0x1fffff | 0);
    static readonly TWO_PWR_24 = Num.fromInt(TWO_PWR_24_DBL);

    constructor(value: number = 0, private readonly ourLow = value, private readonly ourHigh = value < 0 ? -1 : 0) {
        super(value);
    }

    get isEmpty(): boolean {
        return typeof this.original !== 'number' || isNaN(this.original);
    }

    get isZero(): boolean {
        return this.high === 0 && this.low === 0;
    }

    get isOdd(): boolean {
        return (this.low & 1) === 1;
    }

    get isEven(): boolean {
        return (this.low & 1) === 0;
    }

    get isNegative(): boolean {
        return this.high < 0;
    }

    get isPositive(): boolean {
        return this.high >= 0;
    }

    get isInteger(): boolean {
        return Number.isInteger(this.original);
    }

    get high(): number {
        return this.ourHigh;
    }

    get low(): number {
        return this.ourLow;
    }

    static isNum(val: any): val is Num {
        return val instanceof Num;
    }

    static of(val: any): Num {
        return new Num(Number(val));
    }

    static from(val: any): Num {
        return Num.isNum(val)
            ? val
            : Num.of(val);
    }

    static fromInt(val: number): Num {
        if (!isCacheable(val)) {
            return Num.of(val);
        }

        if (!Num.INT_CACHE.has(val)) {
            Num.INT_CACHE.set(val, Num.of(val));
        }

        return Num.INT_CACHE.get(val);
    }

    static fromNumber(value: number): Num {
        return fromNumberToNum(value);
    }

    static fromBits(lowBits: number, highBits: number): Num {
        // @todo: confirm original value
        return new Num(lowBits, lowBits, highBits);
    }

    static fromString(str: string, radix: number = DEFAULT_NUM_RADIX): Num {
        return fromStringToNum(str, radix);
    }

    static fromValue(val: any = 0): Num {
        return fromValueToNum(val);
    }

    toNumber(): number {
        return this.ourHigh * TWO_PWR_32_DBL + (this.ourLow >>> 0);
    }

    toString(radix: number = DEFAULT_NUM_RADIX): string {
        return `${fromNumToString(this, radix)}`;
    }

    toInt(): number {
        return this.low;
    }

    toNumberOrInfinity() {
        if (this.lessThan(Num.MIN_SAFE_VALUE)) {
            return Number.NEGATIVE_INFINITY;
        }

        if (this.greaterThan(Num.MAX_SAFE_VALUE)) {
            return Number.POSITIVE_INFINITY;
        }

        return this.toNumber();
    }

    equals(other: any): boolean {
        const otherToUse = Num.isNum(other)
            ? other
            : Num.fromValue(other);

        return this.high === otherToUse.high && this.low === otherToUse.low;
    }

    lessThan(other: number | string | Num): boolean {
        return this.compare(other) < 0;
    }

    lessThanOrEqual(other: number | string | Num): boolean {
        return this.compare(other) <= 0;
    }

    greaterThan(other: number | string | Num): boolean {
        return this.compare(other) > 0;
    }

    greaterThanOrEqual(other: number | string | Num): boolean {
        return this.compare(other) >= 0;
    }

    negate(): Num {
        if (this.equals(Num.MIN_VALUE)) {
            return Num.MIN_VALUE;
        }

        return this.not().add(Num.ONE);
    }

    add(other: number | string | Num): Num {
        const otherToUse = Num.isNum(other)
            ? other
            : Num.fromValue(other);

        return addNums(this, otherToUse);
    }

    subtract(other: number | string | Num): Num {
        const otherToUse = Num.isNum(other)
            ? other
            : Num.fromValue(other);

        return this.add(otherToUse.negate());
    }

    not(): Num {
        return Num.fromBits(~this.low, ~this.high);
    }

    multiply(multiplier: number | string | Num): Num {
        const multiplierToUse = Num.isNum(multiplier)
            ? multiplier
            : Num.fromValue(multiplier);

        return multiplyNum(this, multiplierToUse);
    }

    divide(divisor: number | string | Num): Num {
        const divisorToUse = Num.isNum(divisor)
            ? divisor
            : Num.fromValue(divisor);

        return divideNums(this, divisorToUse);
    }

    modulo(divisor: number | string | Num): Num {
        const divisorToUse = Num.isNum(divisor)
            ? divisor
            : Num.fromValue(divisor);

        return this.subtract(this.divide(divisorToUse).multiply(divisorToUse));
    }

    compare(other: number | string | Num): 0 | -1 | 1 {
        const otherToUse = Num.isNum(other)
            ? other
            : Num.fromValue(other);

        return compareNums(this, otherToUse);
    }

    shiftLeft(numBits: number | string | Num): Num {
        const numBitsToUse = Num.isNum(numBits)
            ? numBits
            : Num.fromValue(numBits);

        return shiftNumLeft(this, numBitsToUse);
    }

    shiftRight(numBits: number | string | Num): Num {
        const numBitsToUse = Num.isNum(numBits)
            ? numBits
            : Num.fromValue(numBits);

        return shiftNumRight(this, numBitsToUse);
    }
}
