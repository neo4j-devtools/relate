const EMPTY = 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function arrayHasItems(arr: any): arr is Array<any> {
    return Array.isArray(arr) && arr.length > EMPTY;
}
