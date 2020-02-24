export function arrayHasItems(arr: any): arr is [any, ...any[]] {
    return Array.isArray(arr) && arr.length > 1;
}
