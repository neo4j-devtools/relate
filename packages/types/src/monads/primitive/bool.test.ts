import Bool from './bool.monad';

describe('Bool', () => {
    test('Instantiates', () => {
        const one = new Bool();

        expect(one.constructor).toBe(Bool);
        expect(one.get()).toBe(false);
    });

    test('isEmpty', () => {
        const one = Bool.from('test');
        const two = Bool.from('');

        expect(one.isEmpty).toBe(false);
        expect(two.isEmpty).toBe(false);
    });

    test('isBool', () => {
        const one = Bool.from('test');
        const two = false;

        expect(Bool.isBool(one)).toBe(true);
        expect(Bool.isBool(two)).toBe(false);
    });

    test('of', () => {
        const one = false;
        const two = Bool.from(one);

        expect(Bool.of(one)).toEqual(Bool.from(false));
        // @ts-ignore
        expect(Bool.of(two)).toBe(Bool.from(true));
    });

    test('from', () => {
        const one = false;
        const two = Bool.from(false);

        expect(Bool.from(one)).toBe(two);
        expect(Bool.from(two)).toBe(two);
    });
});
