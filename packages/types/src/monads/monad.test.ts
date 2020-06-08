import Monad from './monad';

describe('Monad', () => {
    test('Instantiates', () => {
        const m = new Monad('test');

        expect(m.constructor).toBe(Monad);
        expect(m.get()).toBe('test');
    });

    describe('equals', () => {
        test('undefined', () => {
            const m = Monad.from(undefined);
            const o = Monad.from(undefined);

            expect(m.equals(o)).toBe(true);
        });

        test('null', () => {
            const m = Monad.from(null);
            const o = Monad.from(null);

            expect(m.equals(o)).toBe(true);
        });

        test('Number', () => {
            const m = Monad.from(1);
            const o = Monad.from(1);

            expect(m.equals(o)).toBe(true);
        });

        test('String', () => {
            const m = Monad.from('foo');
            const o = Monad.from('foo');

            expect(m.equals(o)).toBe(true);
        });

        test('Boolean', () => {
            const m = Monad.from(true);
            const o = Monad.from(true);

            expect(m.equals(o)).toBe(true);
        });

        test('Array', () => {
            const arr = ['test'];
            const m = Monad.from(arr);
            const o = Monad.from(arr);

            expect(m.equals(o)).toBe(true);
        });

        test('Object', () => {
            const obj = {test: true};
            const m = Monad.from(obj);
            const o = Monad.from(obj);

            expect(m.equals(o)).toBe(true);
        });

        test('Map', () => {
            const map = new Map([['test', true]]);
            const m = Monad.from(map);
            const o = Monad.from(map);

            expect(m.equals(o)).toBe(true);
        });
    });

    describe('isEmpty', () => {
        test('falsey', () => {
            const undef = Monad.from(undefined);
            const notTrue = Monad.from(false);
            const nulled = Monad.from(null);
            const zero = Monad.from(0);
            const emptyStr = Monad.from('');

            expect(undef.isEmpty).toBe(true);
            expect(notTrue.isEmpty).toBe(true);
            expect(nulled.isEmpty).toBe(true);
            expect(zero.isEmpty).toBe(true);
            expect(emptyStr.isEmpty).toBe(true);
        });

        test('truthy', () => {
            const notFalse = Monad.from(true);
            const notZero = Monad.from(1);
            const str = Monad.from('hi');

            expect(notFalse.isEmpty).toBe(false);
            expect(notZero.isEmpty).toBe(false);
            expect(str.isEmpty).toBe(false);
        });
    });

    describe('isThis', () => {
        const one = Monad.from(1);
        const two = Monad.from(2);
        const three = Monad.from('foo');

        test('Works with same instance', () => {
            expect(one.isThis(one)).toBe(true);
        });

        test('Works with other instance', () => {
            expect(one.isThis(two)).toBe(true);
        });

        test('Works with other value type', () => {
            expect(one.isThis(three)).toBe(true);
        });
    });

    describe('isMonad', () => {
        const one = Monad.from(1);
        const two = Monad.from(undefined);
        const three = 'foo';

        test('Works with monad instance', () => {
            expect(Monad.isMonad(one)).toBe(true);
        });

        test('Works with empty monad instance', () => {
            expect(Monad.isMonad(two)).toBe(true);
        });

        test('Works with non-monad', () => {
            expect(Monad.isMonad(three)).toBe(false);
        });
    });

    describe('from', () => {
        const one = Monad.from(1);
        const two = Monad.from(undefined);
        const three = 'foo';

        test('Works with monad instance', () => {
            const created = Monad.from(one);

            expect(created instanceof Monad).toBe(true);
            expect(created.equals(one)).toBe(true);
        });

        test('Works with empty monad instance', () => {
            const created = Monad.from(two);

            expect(created instanceof Monad).toBe(true);
            expect(created.equals(two)).toBe(true);
        });

        test('Works with non-monad', () => {
            const created = Monad.from(three);

            expect(created instanceof Monad).toBe(true);
            expect(created.equals(three)).toBe(true);
        });
    });

    describe('of', () => {
        const one = Monad.from(1);
        const two = Monad.from(undefined);
        const three = 'foo';

        test('Works with monad instance', () => {
            const created = Monad.of(one);

            expect(created instanceof Monad).toBe(true);
            expect(created.get() === one).toBe(true);
        });

        test('Works with empty monad instance', () => {
            const created = Monad.of(two);

            expect(created instanceof Monad).toBe(true);
            expect(created.get() === two).toBe(true);
        });

        test('Works with non-monad', () => {
            const created = Monad.of(three);

            expect(created instanceof Monad).toBe(true);
            expect(created.equals(three)).toBe(true);
        });
    });

    describe('get', () => {
        test('handles primitives', () => {
            const undef = Monad.from(undefined);
            const notTrue = Monad.from(false);
            const nulled = Monad.from(null);
            const zero = Monad.from(0);
            const emptyStr = Monad.from('');

            expect(undef.get()).toBe(undefined);
            expect(notTrue.get()).toBe(false);
            expect(nulled.get()).toBe(null);
            expect(zero.get()).toBe(0);
            expect(emptyStr.get()).toBe('');
        });

        test('handles objects', () => {
            const object = Monad.from({foo: 'bar'});
            const arr = Monad.from(['hi']);
            const map = Monad.from(new Map([['test', true]]));

            expect(object.get()).toEqual({foo: 'bar'});
            expect(arr.get()).toEqual(['hi']);
            expect(map.get()).toEqual(new Map([['test', true]]));
        });
    });

    describe('map', () => {
        test('preserves monad type', () => {
            const one = Monad.from('foo');
            const mapped = one.map(() => 'bar');

            expect(one.isThis(mapped)).toBe(true);
            expect(mapped.equals('bar')).toBe(true);
        });
    });

    describe('flatMap', () => {
        test('unpacks monad instance', () => {
            const one = Monad.from('foo');
            const mapped = one.flatMap(() => 'bar');

            expect(mapped).toBe('bar');
        });

        test('does not recurse', () => {
            const one = Monad.of(Monad.from('foo'));
            const mapped = one.flatMap((_) => _);

            expect(mapped instanceof Monad).toBe(true);
            expect(mapped.equals(Monad.from('foo'))).toBe(true);
        });
    });

    describe('switchMap', () => {
        test('replaces monad instance', () => {
            const one = Monad.from('foo');
            const mapped = one.switchMap(() => Monad.from('bar'));

            expect(mapped.equals('bar')).toBe(true);
        });
    });

    describe('getOrElse', () => {
        test('handles raw values', () => {
            expect(Monad.of('').getOrElse('foo')).toBe('foo');
            expect(Monad.of(-1).getOrElse(10)).toBe(-1);
            // @ts-ignore
            expect(Monad.of(null).getOrElse('bar')).toBe('bar');
            expect(Monad.of(false).getOrElse(true)).toBe(true);
        });

        test('handles function values', () => {
            expect(Monad.of('').getOrElse(() => 'foo')).toBe('foo');
            expect(Monad.of(-1).getOrElse(() => 10)).toBe(-1);
            // @ts-ignore
            expect(() =>
                Monad.of(null).getOrElse(() => {
                    throw new Error('err');
                }),
            ).toThrow(new Error('err'));
            expect(Monad.of(false).getOrElse(() => true)).toBe(true);
        });
    });
});
