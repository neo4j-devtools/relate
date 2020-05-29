import None from './none.monad';

describe('None', () => {
    test('Instantiates', () => {
        const one = new None();

        expect(one.constructor).toBe(None);
        expect(one.get()).toBe(undefined);
    });

    test('isEmpty', () => {
        const one = None.from('test');
        const two = None.from('');

        expect(one.isEmpty).toBe(true);
        expect(two.isEmpty).toBe(true);
    });

    test('isNone', () => {
        const one = None.from('test');
        const two = 'foo';

        expect(None.isNone(one));
        expect(None.isNone(two)).toBe(false);
    });

    test('of', () => {
        const one = 'test';
        const two = None.from('test');

        expect(None.of(one)).toBe(two);
    });

    test('from', () => {
        const one = 'test';
        const two = None.from('test');

        expect(None.from(one)).toBe(two);
        expect(None.from(two)).toBe(two);
    });
});
