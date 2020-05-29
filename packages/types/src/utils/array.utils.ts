export function arrayHasItems<T = any>(arr: readonly T[]): arr is [T, ...T[]] {
    return Array.isArray(arr) && arr.length > 0;
}
