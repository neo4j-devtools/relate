import Maybe from './maybe.monad';
import None from './none.monad';
import Nil from './nil.monad';
import List from './list.monad';
import Dict from './dict.monad';

describe('Maybe', () => {
    describe('from', () => {
        test('handles all values', () => {
            expect(Maybe.from()).toBe(Maybe.EMPTY);
            expect(Maybe.from(null)).toBe(Maybe.EMPTY);
            expect(Maybe.from('foo').get()).toBe('foo');
            expect(Maybe.from(false).get()).toBe(false);
            expect(Maybe.from(0).get()).toBe(0);
            expect(Maybe.from(None.EMPTY)).toBe(Maybe.EMPTY);
            expect(Maybe.from(Nil.NULL)).toBe(Maybe.EMPTY);
            expect(Maybe.from(List.from(['foo'])).get()).toEqual(List.from(['foo']));
            expect(Maybe.from(Dict.from({foo: true})).get()).toEqual(Dict.from({foo: true}));
        });
    });
});
