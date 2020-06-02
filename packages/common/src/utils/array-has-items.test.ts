import {arrayHasItems} from './array-has-items';

describe('arrayHasItems', () => {
    test('with non-empty array', () => {
        expect(arrayHasItems(['something'])).toBe(true);
        expect(arrayHasItems([null])).toBe(true);
        expect(arrayHasItems([undefined])).toBe(true);
        expect(arrayHasItems([1, 2, 3])).toBe(true);
    });

    test('with empty array', () => {
        expect(arrayHasItems([])).toBe(false);
    });

    test('with non-array value', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        expect(arrayHasItems(new Set([]))).toBe(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        expect(arrayHasItems({})).toBe(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        expect(arrayHasItems('something')).toBe(false);
    });
});
