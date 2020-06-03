export function arrayHasItems<T = any>(arr?: T[]): arr is [T, ...T[]] {
    return Array.isArray(arr) && arr.length > 0;
}
