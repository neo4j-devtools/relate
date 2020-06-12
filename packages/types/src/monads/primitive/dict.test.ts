import Dict from './dict.monad';
import List from './list.monad';
import Maybe from './maybe.monad';

describe('Dict', () => {
    describe('from', () => {
        test('handles safe values', () => {
            expect(Dict.from([['foo', 'bar']]).toObject()).toEqual({foo: 'bar'});
            expect(Dict.from(new Map([['foo', 'bar']])).toObject()).toEqual({foo: 'bar'});
            expect(Dict.from({foo: 'bar'}).toObject()).toEqual({foo: 'bar'});
            // @ts-ignore
            expect(Dict.from(List.from([['foo', 'bar']])).toObject()).toEqual({foo: 'bar'});
        });

        test('handles unsafe values', () => {
            expect(Dict.from().toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.from([]).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.from(null).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.from(1).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.from(false).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.from('').toObject()).toEqual({});
        });
    });

    describe('of', () => {
        test('handles safe values', () => {
            expect(Dict.of([['foo', 'bar']]).toObject()).toEqual({foo: 'bar'});
            expect(Dict.of(new Map([['foo', 'bar']])).toObject()).toEqual({foo: 'bar'});
            expect(Dict.of({foo: 'bar'}).toObject()).toEqual({foo: 'bar'});
            // @ts-ignore
            expect(Dict.of(List.from([['foo', 'bar']])).toObject()).toEqual({foo: 'bar'});
        });

        test('handles unsafe values', () => {
            // @ts-ignore
            expect(Dict.of([]).toObject()).toEqual({});
            expect(Dict.of(null).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.of(1).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.of(false).toObject()).toEqual({});
            // @ts-ignore
            expect(Dict.of('').toObject()).toEqual({});
        });
    });

    describe('isEmpty', () => {
        test('handles empty', () => {
            expect(Dict.from().isEmpty).toBe(true);
            expect(Dict.from({}).isEmpty).toBe(true);
            expect(Dict.from(List.from()).isEmpty).toBe(true);
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).isEmpty).toBe(false);
            expect(Dict.from([['foo', true]]).isEmpty).toBe(false);
            expect(Dict.from(List.from([['foo', true]])).isEmpty).toBe(false);
        });
    });

    describe('keys', () => {
        test('handles empty', () => {
            expect(Dict.from().keys).toEqual(List.from());
            expect(Dict.from({}).keys).toEqual(List.from());
            expect(Dict.from(List.from()).keys).toEqual(List.from());
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).keys).toEqual(List.from(['foo']));
            expect(Dict.from([['foo', true]]).keys).toEqual(List.from(['foo']));
            expect(Dict.from(List.from([['foo', true]])).keys).toEqual(List.from(['foo']));
        });
    });

    describe('values', () => {
        test('handles empty', () => {
            expect(Dict.from().values).toEqual(List.from());
            expect(Dict.from({}).values).toEqual(List.from());
            expect(Dict.from(List.from()).values).toEqual(List.from());
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).values).toEqual(List.from([true]));
            expect(Dict.from([['foo', 1]]).values).toEqual(List.from([1]));
            expect(Dict.from(List.from([['foo', null]])).values).toEqual(List.from([null]));
        });
    });

    describe('isDict', () => {
        test('works', () => {
            expect(Dict.isDict(Dict.from())).toBe(true);
            expect(Dict.isDict([])).toBe(false);
        });
    });

    describe('hasIndex', () => {
        test('handles empty', () => {
            expect(Dict.from().hasIndex(40)).toBe(false);
            expect(Dict.from({}).hasIndex(0)).toBe(false);
            expect(Dict.from(List.from()).hasIndex(5)).toBe(false);
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).hasIndex(0)).toBe(true);
            expect(Dict.from({foo: true}).hasIndex(2)).toBe(false);
            expect(Dict.from([['foo', 1]]).hasIndex(0)).toBe(true);
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).hasIndex(1),
            ).toBe(true);
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).hasIndex(1000),
            ).toBe(false);
            expect(Dict.from(List.from([['foo', null]])).hasIndex(0)).toBe(true);
            expect(Dict.from(List.from([['foo', null]])).hasIndex(4)).toBe(false);
        });
    });

    describe('getKey', () => {
        test('handles empty', () => {
            expect(Dict.from().getKey(40)).toEqual(Maybe.EMPTY);
            expect(Dict.from({}).getKey(0)).toEqual(Maybe.EMPTY);
            expect(Dict.from(List.from()).getKey(5)).toEqual(Maybe.EMPTY);
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).getKey(0)).toEqual(Maybe.from('foo'));
            expect(Dict.from({foo: true}).getKey(2)).toEqual(Maybe.EMPTY);
            expect(Dict.from([['foo', 1]]).getKey(0)).toEqual(Maybe.from('foo'));
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).getKey(1),
            ).toEqual(Maybe.from('bar'));
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).getKey(1000),
            ).toEqual(Maybe.EMPTY);
            expect(Dict.from(List.from([['foo', null]])).getKey(0)).toEqual(Maybe.from('foo'));
            expect(Dict.from(List.from([['foo', null]])).getKey(4)).toEqual(Maybe.EMPTY);
        });
    });

    describe('hasKey', () => {
        test('handles empty', () => {
            // @ts-ignore
            expect(Dict.from().hasKey('foo')).toBe(false);
            // @ts-ignore
            expect(Dict.from({}).hasKey('bar')).toBe(false);
            // @ts-ignore
            expect(Dict.from(List.from()).hasKey(5)).toBe(false);
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).hasKey('foo')).toBe(true);
            // @ts-ignore
            expect(Dict.from({foo: true}).hasKey('bar')).toBe(false);
            expect(Dict.from([['foo', 1]]).hasKey('foo')).toBe(true);
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).hasKey('bar'),
            ).toBe(true);
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).hasKey('baz'),
            ).toBe(false);
            expect(Dict.from(List.from([['foo', null]])).hasKey('foo')).toBe(true);
            expect(Dict.from(List.from([['foo', null]])).hasKey('bar')).toBe(false);
        });
    });

    describe('getValue', () => {
        test('handles empty', () => {
            // @ts-ignore
            expect(Dict.from().getValue('foo')).toEqual(Maybe.EMPTY);
            // @ts-ignore
            expect(Dict.from({}).getValue('bar')).toEqual(Maybe.EMPTY);
            // @ts-ignore
            expect(Dict.from(List.from()).getValue('bam')).toEqual(Maybe.EMPTY);
        });

        test('handles non-empty', () => {
            expect(Dict.from({foo: true}).getValue('foo')).toEqual(Maybe.from(true));
            // @ts-ignore
            expect(Dict.from({foo: true}).getValue('bar')).toEqual(Maybe.EMPTY);
            expect(Dict.from([['foo', 1]]).getValue('foo')).toEqual(Maybe.from(1));
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).getValue('bar'),
            ).toEqual(Maybe.from('bam'));
            expect(
                Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]).getValue('bam'),
            ).toEqual(Maybe.EMPTY);
            expect(Dict.from(List.from([['foo', null]])).getValue('foo')).toEqual(Maybe.from(null));
            expect(Dict.from(List.from([['foo', null]])).getValue('bam')).toEqual(Maybe.EMPTY);
        });
    });

    describe('toString', () => {
        test('handles empty', () => {
            // @ts-ignore
            expect(`${Dict.from()}`).toBe('{}');
            // @ts-ignore
            expect(`${Dict.from({})}`).toBe('{}');
            // @ts-ignore
            expect(`${Dict.from(List.from())}`).toBe('{}');
        });

        test('handles non-empty', () => {
            expect(`${Dict.from({foo: true})}`).toBe('{foo: true}');
            expect(`${Dict.from([['foo', 1]])}`).toBe('{foo: 1}');
            expect(
                `${Dict.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ])}`,
            ).toBe('{foo: 1, bar: "bam"}');
            expect(`${Dict.from([['foo', null]])}`).toBe('{foo: null}');
        });
    });

    describe('omit', () => {
        test('works', () => {
            expect(Dict.from({foo: 1}).omit('foo')).toEqual(Dict.from());
            expect(
                Dict.from({
                    foo: 1,
                    bar: 'bam',
                }).omit('foo'),
            ).toEqual(Dict.from({bar: 'bam'}));
        });
    });

    describe('merge', () => {
        test('works', () => {
            expect(Dict.from({foo: 1}).merge(Dict.from())).toEqual(Dict.from({foo: 1}));
            expect(Dict.from({foo: 1}).merge(Dict.from({bar: 'bam'}))).toEqual(
                Dict.from({
                    foo: 1,
                    bar: 'bam',
                }),
            );
        });
    });

    describe('toList', () => {
        test('works', () => {
            expect(Dict.from({foo: 1}).toList()).toEqual(List.from([['foo', 1]]));
            expect(
                Dict.from({
                    foo: 1,
                    bar: 'bam',
                }).toList(),
            ).toEqual(
                List.from([
                    ['foo', 1],
                    ['bar', 'bam'],
                ]),
            );
        });
    });
});
