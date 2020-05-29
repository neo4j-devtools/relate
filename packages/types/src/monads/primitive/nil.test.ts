import Nil from './nil.monad';

describe('Nil', () => {
    test('Instantiates', () => {
        const one = new Nil();

        expect(one.constructor).toBe(Nil);
        expect(one.get()).toBe(null);
    });

    test('isEmpty', () => {
        const one = Nil.from('test');
        const two = Nil.from('');

        expect(one.isEmpty).toBe(false);
        expect(two.isEmpty).toBe(false);
    });

    test('isNil', () => {
        const one = Nil.from('test');
        const two = 'foo';

        expect(Nil.isNil(one)).toBe(true);
        expect(Nil.isNil(two)).toBe(false);
    });

    test('of', () => {
        const one = 'test';
        const two = Nil.from('test');

        expect(Nil.of(one)).toBe(two);
    });

    test('from', () => {
        const one = 'test';
        const two = Nil.from('test');

        expect(Nil.from(one)).toBe(two);
        expect(Nil.from(two)).toBe(two);
    });
});
