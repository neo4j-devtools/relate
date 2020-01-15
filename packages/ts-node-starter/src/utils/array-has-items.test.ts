import arrayHasItems from './array-has-items';

describe('arrayHasItems', () => {
    it('returns true for non-empty arrays', () => {
        expect(arrayHasItems([undefined])).toBe(true);
    });

    it('returns false for empty arrays', () => {
        expect(arrayHasItems([])).toBe(false);
    });
});
