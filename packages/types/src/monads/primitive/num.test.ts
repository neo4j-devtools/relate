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
})
