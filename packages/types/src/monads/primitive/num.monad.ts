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
        return !this.isEmpty && !this.isEven;
    }

    get isEven(): boolean {
        return Math.abs(this.original % 2) === 0;
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
        if (val === undefined) {
            return Num.ZERO;
        }

        if (!Num.isCacheable(val)) {
            return Num.isNum(val) ? val : Num.of(val);
        }

        if (!Num.INT_CACHE.has(val)) {
            Num.INT_CACHE.set(val, Num.of(val));
        }

        return Num.INT_CACHE.get(val);
    }

    toString(radix = 10): string {
        return `${this.original.toString(radix)}`;
    }

    toInt(): Num {
        return this.flatMap((v) => Num.from(Math.trunc(v)));
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
        return this.flatMap((v) => Num.from(v * -1));
    }

    add(other: number | string | Num): Num {
        const otherToUse = Num.from(other);

        return this.flatMap((v) => Num.from(v + otherToUse.get()));
    }

    subtract(other: number | string | Num): Num {
        const otherToUse = Num.from(other);

        return this.add(otherToUse.negate());
    }

    multiply(multiplier: number | string | Num): Num {
        const multiplierToUse = Num.from(multiplier);

        return this.flatMap((v) => Num.from(v * multiplierToUse.get()));
    }

    divide(divisor: number | string | Num): Num {
        const divisorToUse = Num.from(divisor);

        return this.flatMap((v) => Num.from(v / divisorToUse.get()));
    }

    modulo(divisor: number | string | Num): Num {
        const divisorToUse = Num.isNum(divisor) ? divisor : Num.from(divisor);

        return this.flatMap((v) => Num.from(v % divisorToUse.get()));
    }

    private compare(other: number | string | Num): number {
        const otherToUse = Num.from(other);

        return this.flatMap((v) => {
            const o = otherToUse.get();

            if (this.isEmpty || otherToUse.isEmpty) {
                return NaN;
            }

            if (o === v) {
                return 0;
            }

            return o > v ? -1 : 1;
        });
    }
}
