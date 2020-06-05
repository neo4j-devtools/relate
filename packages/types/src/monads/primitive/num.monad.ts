import Monad from '../monad';

// @ts-ignore
export default class Num extends Monad<number> {
    static readonly INT_CACHE = new Map();
    static readonly ZERO = Num.from(0);
    static readonly ONE = Num.from(1);
    static readonly NEG_ONE = Num.from(-1);
    static readonly MAX_VALUE = Num.from(Number.MAX_SAFE_INTEGER);
    static readonly MIN_VALUE = Num.from(Number.MIN_SAFE_INTEGER);

    static isCacheable(value: number) {
        return value >= -128 && value < 128;
    }

    get isEmpty(): boolean {
        return typeof this.original !== 'number' || isNaN(this.original);
    }

    get isZero(): boolean {
        return this.original === 0;
    }

    get isOdd(): boolean {
        return (this.original & 1) === 1;
    }

    get isEven(): boolean {
        return (this.original & 1) === 0;
    }

    get isNegative(): boolean {
        return this.original < 0;
    }

    get isPositive(): boolean {
        return this.original >= 0;
    }

    get isInteger(): boolean {
        return Number.isInteger(this.original);
    }

    static isNum(val: any): val is Num {
        return val instanceof Num;
    }

    static of(val: any): Num {
        return new Num(Number(val));
    }

    static from(val?: any): Num {
        if (!Num.isCacheable(val)) {
            return Num.isNum(val) ? val : Num.of(val);
        }

        if (!Num.INT_CACHE.has(val)) {
            Num.INT_CACHE.set(val, Num.of(val));
        }

        return Num.INT_CACHE.get(val);
    }

    toString(radix: number = 10): string {
        return `${this.original.toString(radix)}`;
    }

    toInt(): number {
        return this.original;
    }

    equals(other: any): boolean {
        const otherToUse = Num.from(other);

        return this.get() === otherToUse.get();
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

        return this.not();
    }

    add(other: number | string | Num): Num {
        const otherToUse = Num.from(other);

        return this.map((v) => v + otherToUse.get());
    }

    subtract(other: number | string | Num): Num {
        const otherToUse = Num.from(other);

        return this.add(otherToUse.negate());
    }

    not(): Num {
        return this.map((v) => v * -1);
    }

    multiply(multiplier: number | string | Num): Num {
        const multiplierToUse = Num.from(multiplier);

        return this.map((v) => v * multiplierToUse.get());
    }

    divide(divisor: number | string | Num): Num {
        const divisorToUse = Num.from(divisor);

        return this.map((v) => v / divisorToUse.get());
    }

    modulo(divisor: number | string | Num): Num {
        const divisorToUse = Num.isNum(divisor) ? divisor : Num.from(divisor);

        return this.subtract(this.divide(divisorToUse).multiply(divisorToUse));
    }

    private compare(other: number | string | Num): 0 | 1 | -1 {
        const otherToUse = Num.from(other);

        return this.flatMap((v) => {
            if (otherToUse.equals(v)) {
                return 0;
            }

            return otherToUse.greaterThan(v)
                ? -1
                : 1
        });
    }
}
