import Num from './num.monad';

describe('Num', () => {
    describe('from', () => {
        test('handles safe values', () => {
            expect(Num.from(0).get()).toBe(0);
            expect(Num.from(10).get()).toBe(10);
            expect(Num.from(-57).get()).toBe(-57);
            expect(Num.from('-57').get()).toBe(-57);
        });

        test('unsafe values', () => {
            expect(Num.from('foo').get()).toBe(NaN);
            expect(Num.from({}).get()).toBe(NaN);
            expect(Num.from([]).get()).toBe(0);
            expect(Num.from(['4']).get()).toBe(4);
            expect(Num.from(['4', 6]).get()).toBe(NaN);
            expect(Num.from().get()).toBe(0);
        });
    });

    describe('of', () => {
        test('handles safe values', () => {
            expect(Num.of(0).get()).toBe(0);
            expect(Num.of(10).get()).toBe(10);
            expect(Num.of(-57).get()).toBe(-57);
            expect(Num.of('-57').get()).toBe(-57);
        });

        test('unsafe values', () => {
            expect(Num.of('foo').get()).toBe(NaN);
            expect(Num.of({}).get()).toBe(NaN);
            expect(Num.of([]).get()).toBe(0);
            expect(Num.of(['4']).get()).toBe(4);
            expect(Num.of(['4', 6]).get()).toBe(NaN);
        });
    });

    describe('isEmpty', () => {
        test('works', () => {
            expect(Num.ZERO.isEmpty).toBe(false);
            expect(Num.from(11).isEmpty).toBe(false);
            expect(Num.from(-11.3).isEmpty).toBe(false);
            expect(Num.from('foo').isEmpty).toBe(true);
            expect(Num.from({}).isEmpty).toBe(true);
        });
    });

    describe('isPositive', () => {
        test('works', () => {
            expect(Num.ZERO.isPositive).toBe(true);
            expect(Num.from(11).isPositive).toBe(true);
            expect(Num.from(-11.3).isPositive).toBe(false);
            expect(Num.from('foo').isPositive).toBe(false);
        });
    });

    describe('isNegative', () => {
        test('works', () => {
            expect(Num.ZERO.isNegative).toBe(false);
            expect(Num.from(11).isNegative).toBe(false);
            expect(Num.from(-11.3).isNegative).toBe(true);
            expect(Num.from('foo').isNegative).toBe(false);
        });
    });

    describe('isEven', () => {
        test('works', () => {
            expect(Num.ZERO.isEven).toBe(true);
            expect(Num.from(11).isEven).toBe(false);
            expect(Num.from(66).isEven).toBe(true);
            expect(Num.from(-11.3).isEven).toBe(false);
            expect(Num.from(-12).isEven).toBe(true);
            expect(Num.from('foo').isEven).toBe(false);
        });
    });

    describe('isOdd', () => {
        test('works', () => {
            expect(Num.ZERO.isOdd).toBe(false);
            expect(Num.from(11).isOdd).toBe(true);
            expect(Num.from(66).isOdd).toBe(false);
            expect(Num.from(-11.3).isOdd).toBe(true);
            expect(Num.from(-12).isOdd).toBe(false);
            expect(Num.from('foo').isOdd).toBe(false);
        });
    });

    describe('isInteger', () => {
        test('works', () => {
            expect(Num.ZERO.isInteger).toBe(true);
            expect(Num.from(11).isInteger).toBe(true);
            expect(Num.from(6.6).isInteger).toBe(false);
            expect(Num.from(-11.3).isInteger).toBe(false);
            expect(Num.from(-12).isInteger).toBe(true);
            expect(Num.from('foo').isInteger).toBe(false);
        });
    });

    describe('toString', () => {
        test('works', () => {
            expect(`${Num.ZERO}`).toBe('0');
            expect(`${Num.from(11)}`).toBe('11');
            expect(`${Num.from(6.6)}`).toBe('6.6');
            expect(`${Num.from(-11.3)}`).toBe('-11.3');
            expect(`${Num.from(12)}`).toBe('12');
            expect(`${Num.from('foo')}`).toBe('NaN');
        });
    });

    describe('toInt', () => {
        test('works', () => {
            expect(Num.ZERO.toInt()).toEqual(Num.from(0));
            expect(Num.from(11).toInt()).toEqual(Num.from(11));
            expect(Num.from(6.6).toInt()).toEqual(Num.from(6));
            expect(Num.from(-11.3).toInt()).toEqual(Num.from(-11));
            expect(Num.from(-12).toInt()).toEqual(Num.from(-12));
            expect(Num.from('foo').toInt()).toEqual(Num.from('foo'));
        });
    });

    describe('equals', () => {
        test('works', () => {
            expect(Num.ZERO.equals(0)).toBe(true);
            expect(Num.from(11).equals(11)).toBe(true);
            expect(Num.from(6.6).equals(9)).toBe(false);
            expect(Num.from(-11.3).equals(34)).toBe(false);
            expect(Num.from(-12).equals(12)).toBe(false);
            expect(Num.from('foo').equals(4)).toBe(false);
        });
    });

    describe('lessThan', () => {
        test('works', () => {
            expect(Num.ZERO.lessThan(0)).toBe(false);
            expect(Num.from(11).lessThan(11)).toBe(false);
            expect(Num.from(6.6).lessThan(9)).toBe(true);
            expect(Num.from(-11.3).lessThan(34)).toBe(true);
            expect(Num.from(-12).lessThan(12)).toBe(true);
            expect(Num.from('foo').lessThan(4)).toBe(false);
        });
    });

    describe('lessThanOrEqual', () => {
        test('works', () => {
            expect(Num.ZERO.lessThanOrEqual(0)).toBe(true);
            expect(Num.from(11).lessThanOrEqual(11)).toBe(true);
            expect(Num.from(6.6).lessThanOrEqual(9)).toBe(true);
            expect(Num.from(-11.3).lessThanOrEqual(34)).toBe(true);
            expect(Num.from(-12).lessThanOrEqual(12)).toBe(true);
            expect(Num.from(12).lessThanOrEqual(-12)).toBe(false);
            expect(Num.from('foo').lessThanOrEqual(4)).toBe(false);
        });
    });

    describe('greaterThan', () => {
        test('works', () => {
            expect(Num.ZERO.greaterThan(0)).toBe(false);
            expect(Num.from(11).greaterThan(11)).toBe(false);
            expect(Num.from(9).greaterThan(-6.6)).toBe(true);
            expect(Num.from(34).greaterThan(-11.3)).toBe(true);
            expect(Num.from(-12).greaterThan(12)).toBe(false);
            expect(Num.from('foo').greaterThan(4)).toBe(false);
        });
    });

    describe('greaterThanOrEqual', () => {
        test('works', () => {
            expect(Num.ZERO.greaterThanOrEqual(0)).toBe(true);
            expect(Num.from(11).greaterThanOrEqual(11)).toBe(true);
            expect(Num.from(9).greaterThanOrEqual(-6.6)).toBe(true);
            expect(Num.from(34).greaterThanOrEqual(-11.3)).toBe(true);
            expect(Num.from(-12).greaterThanOrEqual(12)).toBe(false);
            expect(Num.from('foo').greaterThanOrEqual(4)).toBe(false);
        });
    });

    describe('negate', () => {
        test('works', () => {
            expect(Num.ZERO.negate()).toEqual(Num.from(-0));
            expect(Num.from(11).negate()).toEqual(Num.from(-11));
            expect(Num.from(-9).negate()).toEqual(Num.from(9));
            expect(Num.from(34.6).negate()).toEqual(Num.from(-34.6));
            expect(Num.from(-12).negate()).toEqual(Num.from(12));
            expect(Num.from('foo').negate()).toEqual(Num.from('foo'));
        });
    });

    describe('add', () => {
        test('works', () => {
            expect(Num.ZERO.add(3)).toEqual(Num.from(3));
            expect(Num.from(11).add(-3)).toEqual(Num.from(8));
            expect(Num.from(-9).add(3)).toEqual(Num.from(-6));
            expect(Num.from(34.6).add(-14)).toEqual(Num.from(20.6));
            expect(Num.from(-12).add(3.7)).toEqual(Num.from(-8.3));
            expect(Num.from('foo').add(3)).toEqual(Num.from('foo'));
        });
    });

    describe('subtract', () => {
        test('works', () => {
            expect(Num.ZERO.subtract(3)).toEqual(Num.from(-3));
            expect(Num.from(11).subtract(-3)).toEqual(Num.from(14));
            expect(Num.from(-9).subtract(3)).toEqual(Num.from(-12));
            expect(Num.from(34.6).subtract(-14)).toEqual(Num.from(48.6));
            expect(Num.from(-12).subtract(3.7)).toEqual(Num.from(-15.7));
            expect(Num.from('foo').subtract(3)).toEqual(Num.from('foo'));
        });
    });

    describe('multiply', () => {
        test('works', () => {
            expect(Num.ZERO.multiply(3)).toEqual(Num.from(0));
            expect(Num.from(11).multiply(-3)).toEqual(Num.from(-33));
            expect(Num.from(-9).multiply(3)).toEqual(Num.from(-27));
            expect(Num.from(34.6).multiply(-14)).toEqual(Num.from(-484.40000000000003));
            expect(Num.from(-12).multiply(3.7)).toEqual(Num.from(-44.400000000000006));
            expect(Num.from('foo').multiply(3)).toEqual(Num.from('foo'));
        });
    });

    describe('divide', () => {
        test('works', () => {
            expect(Num.ZERO.divide(3)).toEqual(Num.from(0));
            expect(Num.from(11).divide(-3)).toEqual(Num.from(-3.6666666666666665));
            expect(Num.from(-9).divide(3)).toEqual(Num.from(-3));
            expect(Num.from(34.6).divide(-14)).toEqual(Num.from(-2.4714285714285715));
            expect(Num.from(-12).divide(3.7)).toEqual(Num.from(-3.243243243243243));
            expect(Num.from('foo').divide(3)).toEqual(Num.from('foo'));
        });
    });

    describe('modulo', () => {
        test('works', () => {
            expect(Num.ZERO.modulo(3)).toEqual(Num.from(0));
            expect(Num.from(11).modulo(2)).toEqual(Num.ONE);
            expect(Num.from(-9).modulo(3)).toEqual(Num.from(-0));
            expect(Num.from(34.6).modulo(-14)).toEqual(Num.from(6.600000000000001));
            expect(Num.from(-12).modulo(3)).toEqual(Num.from(0));
            expect(Num.from(-132).modulo(30)).toEqual(Num.from(-12));
            expect(Num.from('foo').modulo(3)).toEqual(Num.from('foo'));
        });
    });
});
