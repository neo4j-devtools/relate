import Str from './str.monad';

describe('Str', () => {
    test('Instantiates', () => {
        const one = new Str('test');

        expect(one.constructor).toBe(Str);
        expect(one.get()).toBe('test');
    });

    test('isEmpty', () => {
        const one = Str.from('test');
        const two = Str.from('');

        expect(one.isEmpty).toBe(false);
        expect(two.isEmpty).toBe(true);
    });

    test('isStr', () => {
        const one = Str.from('test');
        const two = 'foo';

        expect(Str.isStr(one)).toBe(true);
        expect(Str.isStr(two)).toBe(false);
    });

    test('of', () => {
        const one = 'test';
        const two = Str.from('test');

        expect(Str.of(one)).toEqual(two);
    });

    test('from', () => {
        const one = 'test';
        const two = Str.from('test');

        expect(Str.from(one)).toEqual(two);
        expect(Str.from(two)).toEqual(two);
        // eslint-disable-next-line no-self-compare
        expect(two === two).toBe(true);
    });
});
