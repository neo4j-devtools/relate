import List from './list.monad';
import Num from './num/num.monad';
import Maybe from './maybe.monad';
import Str from './str.monad';
import Dict from './dict.monad';

describe('List', () => {
    describe('from', () => {
        test('handles safe values', () => {
            expect(List.from(['foo', 'bar']).toArray()).toEqual(['foo', 'bar']);
            expect(List.from(new Map([['foo', 'bar']])).toArray()).toEqual([['foo', 'bar']]);
            expect(List.from(new Set(['bar', 'foo'])).toArray()).toEqual(['bar', 'foo']);
            // @ts-ignore
            expect(List.from('foo').toArray()).toEqual(['f', 'o', 'o']);
        });

        test('handles unsafe values', () => {
            expect(List.from().toArray()).toEqual([]);
            // @ts-ignore
            expect(List.from({foo: true, bar: 1}).toArray()).toEqual([]);
            expect(List.from(null).toArray()).toEqual([]);
            // @ts-ignore
            expect(List.from(1).toArray()).toEqual([]);
            // @ts-ignore
            expect(List.from(false).toArray()).toEqual([]);
            // @ts-ignore
            expect(List.from('').toArray()).toEqual([]);
        });
    });

    describe('of', () => {
        test('handles safe values', () => {
            expect(List.of(['foo', 'bar']).toArray()).toEqual(['foo', 'bar']);
            expect(List.of(new Map([['foo', 'bar']])).toArray()).toEqual([['foo', 'bar']]);
            expect(List.of(new Set(['bar', 'foo'])).toArray()).toEqual(['bar', 'foo']);
            // @ts-ignore
            expect(List.of('foo').toArray()).toEqual(['f', 'o', 'o']);
        });

        test('handles unsafe values', () => {
            // @ts-ignore
            expect(List.of(undefined).toArray()).toEqual([undefined]);
            // @ts-ignore
            expect(List.of({foo: true, bar: 1}).toArray()).toEqual([{foo: true, bar: 1}]);
            // @ts-ignore
            expect(List.of(null).toArray()).toEqual([null]);
            // @ts-ignore
            expect(List.of(1).toArray()).toEqual([1]);
            // @ts-ignore
            expect(List.of(false).toArray()).toEqual([false]);
            // @ts-ignore
            expect(List.of('').toArray()).toEqual(['']);
        });
    });

    describe('isEmpty', () => {
        test('uses instantiated value', () => {
            expect(List.from([]).isEmpty).toBe(true);
            expect(List.from([1]).isEmpty).toBe(false);
            expect(List.from(new Map([])).isEmpty).toBe(true);
            expect(List.from(new Map([['hurr', {}]])).isEmpty).toBe(false);
            // @ts-ignore
            expect(List.from({foo: 'bar'}).isEmpty).toBe(true);

            // @ts-ignore
            expect(List.of(1).isEmpty).toBe(false);
            expect(List.of(new Map([])).isEmpty).toBe(true);
            expect(List.of(new Map([['hurr', {}]])).isEmpty).toBe(false);
            // @ts-ignore
            expect(List.of({foo: 'bar'}).isEmpty).toBe(false);
        });
    });

    describe('length', () => {
        test('uses instantiated value', () => {
            expect(List.from([]).length).toEqual(Num.from(0));
            expect(List.from([1]).length).toEqual(Num.from(1));
            expect(List.from(new Map([])).length).toEqual(Num.from(0));
            expect(List.from(new Map([['hurr', {}]])).length).toEqual(Num.from(1));
            // @ts-ignore
            expect(List.from({foo: 'bar'}).length).toEqual(Num.from(0));

            // @ts-ignore
            expect(List.of(1).length).toEqual(Num.from(1));
            expect(List.of(new Map([])).length).toEqual(Num.from(0));
            expect(List.of(new Map([['hurr', {}]])).length).toEqual(Num.from(1));
            // @ts-ignore
            expect(List.of({foo: 'bar'}).length).toEqual(Num.from(1));
        });
    });

    describe('first', () => {
        test('returns Maybe', () => {
            expect(List.from().first instanceof Maybe).toBe(true);
        });

        test('returns empty Maybe when empty', () => {
            expect(List.from().first instanceof Maybe).toBe(true);
            expect(List.from().first.isEmpty).toBe(true);
        });

        test('returns Maybe when not empty', () => {
            expect(List.from('foo').first instanceof Maybe).toBe(true);
            expect(List.from('foo').first.isEmpty).toBe(false);
        });

        test('returns correct value', () => {
            expect(List.from('foo').first.get()).toBe('f');
            expect(List.from([1]).first.get()).toBe(1);
            expect(List.from([false]).first.get()).toBe(false);
        });
    });

    describe('last', () => {
        test('returns Maybe', () => {
            expect(List.from().last instanceof Maybe).toBe(true);
        });

        test('returns empty Maybe when empty', () => {
            expect(List.from().last instanceof Maybe).toBe(true);
            expect(List.from().last.isEmpty).toBe(true);
        });

        test('returns Maybe when not empty', () => {
            expect(List.from('foo').last instanceof Maybe).toBe(true);
            expect(List.from('foo').last.isEmpty).toBe(false);
        });

        test('returns correct value', () => {
            expect(List.from('foo').last.get()).toBe('o');
            expect(List.from([1, 2]).last.get()).toBe(2);
            expect(List.from([false, true]).last.get()).toBe(true);
        });
    });

    describe('nth', () => {
        test('returns Maybe', () => {
            expect(List.from().nth(0) instanceof Maybe).toBe(true);
        });

        test('returns empty Maybe when not found', () => {
            expect(List.from().nth(0) instanceof Maybe).toBe(true);
            expect(List.from().nth(0).isEmpty).toBe(true);
        });

        test('returns Maybe when found', () => {
            expect(List.from('foo').nth(0) instanceof Maybe).toBe(true);
            expect(List.from('foo').nth(0).isEmpty).toBe(false);
        });

        test('returns correct value', () => {
            expect(
                List.from('bar')
                    .nth(0)
                    .get(),
            ).toBe('b');
            expect(
                List.from('bar')
                    .nth(1)
                    .get(),
            ).toBe('a');
            expect(
                List.from('bar')
                    .nth(2)
                    .get(),
            ).toBe('r');
            expect(
                List.from([1, 2])
                    .nth(0)
                    .get(),
            ).toBe(1);
            expect(
                List.from([1, 2])
                    .nth(1)
                    .get(),
            ).toBe(2);
            expect(
                List.from([false, true])
                    .nth(0)
                    .get(),
            ).toBe(false);
            expect(
                List.from([false, true])
                    .nth(1)
                    .get(),
            ).toBe(true);
        });
    });

    describe('isList', () => {
        test('works', () => {
            expect(List.isList(List.from())).toBe(true);
            expect(List.isList([])).toBe(false);
        });
    });

    describe('Symbol.iterator', () => {
        test('works', () => {
            expect([...List.from([1, 2, 3])]).toEqual([1, 2, 3]);
            expect([...List.from('foo')]).toEqual(['f', 'o', 'o']);
            // @ts-ignore
            expect([...List.from(true)]).toEqual([]);
        });
    });

    describe('hasIndex', () => {
        const empty = List.from();
        const notEmpty = List.from([1, 'foo', true]);

        test('handles empty', () => {
            expect(empty.hasIndex(1)).toBe(false);
            expect(empty.hasIndex(0)).toBe(false);
            expect(empty.hasIndex(1000000)).toBe(false);
        });

        test('handles non-empty', () => {
            expect(notEmpty.hasIndex(2)).toBe(true);
            expect(notEmpty.hasIndex(1)).toBe(true);
            expect(notEmpty.hasIndex(0)).toBe(true);
            expect(notEmpty.hasIndex(1000000)).toBe(false);
        });
    });

    describe('includes', () => {
        const empty = List.from();
        const notEmpty = List.from([1, 'foo', true]);

        test('handles empty', () => {
            expect(empty.includes(1)).toBe(false);
            expect(empty.includes('foo')).toBe(false);
            expect(empty.includes(true)).toBe(false);
        });

        test('handles non-empty', () => {
            expect(notEmpty.includes(1)).toBe(true);
            expect(notEmpty.includes('foo')).toBe(true);
            expect(notEmpty.includes(true)).toBe(true);
        });
    });

    describe('find', () => {
        const empty = List.from();
        const notEmpty = List.from([1, 'foo', true]);

        test('handles empty', () => {
            expect(empty.find((val) => val === 1)).toEqual(Maybe.EMPTY);
            expect(empty.find((val) => val === 'foo')).toEqual(Maybe.EMPTY);
            expect(empty.find((val) => val === true)).toEqual(Maybe.EMPTY);
        });

        test('handles non-empty', () => {
            expect(notEmpty.find((val) => val === 1)).toEqual(Maybe.of(1));
            expect(notEmpty.find((val) => val === 'foo')).toEqual(Maybe.of('foo'));
            expect(notEmpty.find((val) => val === true)).toEqual(Maybe.of(true));
        });
    });

    describe('filter', () => {
        const empty = List.from();
        const notEmpty = List.from([1, 'foo', true]);

        test('handles empty', () => {
            expect(empty.filter((val) => val === 1)).toEqual(List.from());
            expect(empty.filter((val) => val === 'foo')).toEqual(List.from());
            expect(empty.filter((val) => val === true)).toEqual(List.from());
        });

        test('handles non-empty', () => {
            // @ts-ignore
            expect(notEmpty.filter((val) => val === 1)).toEqual(List.of(1));
            expect(notEmpty.filter((val) => val === 'foo')).toEqual(List.of(['foo']));
            // @ts-ignore
            expect(notEmpty.filter((val) => val === true)).toEqual(List.of(true));
        });
    });

    describe('compact', () => {
        test('removes "empty" values', () => {
            const withEmpties = List.from([null, 1, 'foo', {}, true]);

            expect(withEmpties.compact()).toEqual(List.from([1, 'foo', {}, true]));
        });

        test('preserves "non-empty" values', () => {
            const withEmpties = List.from([Str.from(), Num.from(0), Str.of('foo'), Dict.from(), true]);

            expect(withEmpties.compact()).toEqual(
                List.from([Str.from(), Num.from(0), Str.of('foo'), Dict.from(), true]),
            );
        });
    });

    describe('reduce', () => {
        test('handles empty', () => {
            expect(List.from([]).reduce((agg, [key, val]) => ({...agg, [key]: val}), {})).toEqual({});
        });

        test('handles non-empty', () => {
            expect(List.from([true, false]).reduce((agg, val, index) => ({...agg, [index]: val}), {})).toEqual({
                '0': true,
                '1': false,
            });
        });

        test('handles primitives', () => {
            expect(List.from([false, true]).reduce((agg, val) => agg && val, false)).toBe(false);
        });
    });

    describe('mapEach', () => {
        test('handles empty', () => {
            expect(List.from().mapEach(() => 'foo')).toEqual(List.from());
        });

        test('handles non-empty', () => {
            expect(List.from([1, 2]).mapEach((val) => (val === 1 ? 'foo' : 'bar'))).toEqual(List.from(['foo', 'bar']));
        });
    });

    describe('indexOf', () => {
        test('handles empty', () => {
            expect(List.from().indexOf('foo')).toEqual(Num.from(-1));
            expect(List.from().indexOf(true)).toEqual(Num.from(-1));
            expect(List.from().indexOf({})).toEqual(Num.from(-1));
        });

        test('handles non-empty', () => {
            const obj = {};

            expect(List.from([1, obj, true]).indexOf(0)).toEqual(Num.from(-1));
            expect(List.from([1, obj, true]).indexOf(Num.from(0))).toEqual(Num.from(-1));
            expect(List.from([1, obj, true]).indexOf(1)).toEqual(Num.from(0));
            expect(List.from([1, obj, true]).indexOf(obj)).toEqual(Num.from(1));
            expect(List.from([1, obj, true]).indexOf(true)).toEqual(Num.from(2));
        });
    });

    describe('slice', () => {
        test('handles empty', () => {
            expect(List.from().slice(30, 5000)).toEqual(List.from());
        });

        test('handles non-empty', () => {
            expect(List.from([1, 2, 'foo', {}]).slice(1, 3)).toEqual(List.from([2, 'foo']));
        });

        test('Accepts Num', () => {
            expect(List.from([1, 2, 'foo', {}]).slice(Num.from(1))).toEqual(List.from([2, 'foo', {}]));
        });
    });

    describe('concat', () => {
        test('handles empty', () => {
            expect(List.from().concat(List.from())).toEqual(List.from());
            expect(List.from().concat(List.from([1]))).toEqual(List.from([1]));
        });

        test('handles non-empty', () => {
            expect(List.from(['foo']).concat(List.from())).toEqual(List.from(['foo']));
            expect(List.from(['foo']).concat(List.from([1]))).toEqual(List.from(['foo', 1]));
        });

        test('handles array input', () => {
            expect(List.from(['foo']).concat([])).toEqual(List.from(['foo']));
            expect(List.from(['foo']).concat([1])).toEqual(List.from(['foo', 1]));
        });

        test('handles Map input', () => {
            expect(List.from(['foo']).concat(new Map())).toEqual(List.from(['foo']));
            expect(List.from(['foo']).concat(new Map([['bar', 1]]))).toEqual(List.from(['foo', ['bar', 1]]));
        });

        test('handles Dict input', () => {
            expect(List.from(['foo']).concat(new Map())).toEqual(List.from(['foo']));
            expect(List.from(['foo']).concat(Dict.from({baz: 'yeah'}))).toEqual(List.from(['foo', ['baz', 'yeah']]));
        });

        test('does not unpack monads', () => {
            expect(List.from().concat([Str.from(), Num.from()])).toEqual(List.from([Str.from(), Num.from()]));
        });
    });

    describe('flatten', () => {
        test('handles empty', () => {
            expect(List.from().flatten()).toEqual(List.from());
        });

        test('handles non-empty, non-nested', () => {
            expect(List.from([1, Num.from(0), {}]).flatten()).toEqual(List.from([1, Num.from(0), {}]));
        });

        test('handles non-empty, nested', () => {
            expect(List.from([1, List.from([Num.from(0)]), [{}]]).flatten()).toEqual(List.from([1, Num.from(0), {}]));
        });
    });

    describe('sort', () => {
        test('handles empty, without callback', () => {
            expect(List.from().sort()).toEqual(List.from());
        });

        test('handles empty, with callback', () => {
            expect(List.from().sort(() => -1)).toEqual(List.from());
        });

        test('handles non-empty, without callback', () => {
            expect(List.from([3, 2, 1]).sort()).toEqual(List.from([1, 2, 3]));
        });

        test('handles non-empty, with callback', () => {
            expect(List.from([3, 1, 2]).sort((a, b) => (a > b ? 1 : -1))).toEqual(List.from([1, 2, 3]));
        });
    });

    describe('join', () => {
        test('handles empty', () => {
            expect(List.from().join()).toEqual(Str.from());
        });

        test('handles non-empty', () => {
            expect(List.from([3, 2, 1]).join()).toEqual(Str.from('3,2,1'));
        });

        test('handles non-empty, with custom delimiter', () => {
            expect(List.from([3, 2, 1]).join('-')).toEqual(Str.from('3-2-1'));
        });
    });

    describe('toString', () => {
        test('handles empty', () => {
            expect(`${List.from()}`).toBe('[]');
        });

        test('handles non-empty', () => {
            expect(`${List.from([3, 2, 1])}`).toBe('[3, 2, 1]');
        });
    });

    describe('toArray', () => {
        test('handles empty', () => {
            expect(List.from().toArray()).toEqual([]);
        });

        test('handles non-empty', () => {
            expect(List.from([3, 2, 1]).toArray()).toEqual([3, 2, 1]);
        });
    });

    describe('unwindPromises', () => {
        test('handles empty', async () => {
            expect(await List.from().unwindPromises()).toEqual(List.from());
        });

        test('handles non-empty, without promises', async() => {
            expect(await List.from([3, 2, 1]).unwindPromises()).toEqual(List.from([3, 2, 1]));
        });

        test('handles non-empty, with promises', async() => {
            expect(await List.from([Promise.resolve(4), 3, 2, 1]).unwindPromises()).toEqual(List.from([4, 3, 2, 1]));
        });
    });
});
